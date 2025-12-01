import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';
import { Account, AccountTable } from './schema/account.schema';
import { and, eq, lt } from 'drizzle-orm';
import { SignupRequestDto } from './dto/signup.dto';
import { hash, verify } from 'argon2';
import { User, UserTable } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { SignInRequestDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, type ConfigType } from '@nestjs/config';
import authConfig from './config/auth.config';
import { createId } from '@paralleldrive/cuid2';
import { generateOtp, generateToken } from '../../core/lib/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emitter: EventEmitter2,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  async signup({
    email,
    firstName,
    lastName,
    password,
    phone,
  }: SignupRequestDto) {
    const isExisting = await this.findByEmail(email);
    if (isExisting.account) throw new ConflictException('User already exists');

    const hashedPassword = await hash(password);
    const accountId = createId();
    const otp = generateOtp();
    const token = generateToken();

    return await this.databaseService.db.transaction(async (tx) => {
      const [user] = await tx
        .insert(UserTable)
        .values({
          firstName,
          lastName,
          email,
          contactNumber: phone,
        })
        .returning();

      const { accessToken, refreshToken } = await this.generateToken(user);

      const [account] = await tx
        .insert(AccountTable)
        .values({
          id: accountId,
          password: hashedPassword,
          userId: user.id,
          verificationToken: token,
          verificationOtp: otp,
          verificationExpires: new Date(Date.now() + 5 * 60 * 60),
          accessToken,
          refreshToken,
        })
        .returning();

      this.emitter.emit('user.signup', {
        user,
        account,
      });

      return {
        user: {
          ...user,
          isVerified: account.isVerified,
        },
        accessToken,
        refreshToken,
      };
    });
  }

  async signIn({ email, password }: SignInRequestDto) {
    const { account, user } = await this.findByEmail(email);
    if (!account || !account.password || !user)
      throw new NotFoundException('Invalid email');

    const isValidPassword = await verify(account.password, password);
    if (!isValidPassword) throw new ConflictException('Invalid password');

    const { accessToken, refreshToken } = await this.generateToken(user);

    await this.databaseService.db
      .update(AccountTable)
      .set({
        accessToken,
        refreshToken,
      })
      .where(eq(AccountTable.id, account.id));

    return {
      user: {
        ...user,
        isVerified: account.isVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(account: Account) {
    await this.databaseService.db
      .update(AccountTable)
      .set({
        accessToken: null,
        refreshToken: null,
      })
      .where(eq(AccountTable.id, account.id))
      .returning();
  }

  async refreshToken(token: string) {
    const decoded = await this.jwtService.verifyAsync<{ sub: string }>(
      token,
      this.authConfiguration,
    );

    const [{ account, user }] = await this.databaseService.db
      .select()
      .from(AccountTable)
      .leftJoin(UserTable, eq(AccountTable.userId, UserTable.id))
      .where(
        and(
          eq(AccountTable.userId, decoded.sub),
          eq(AccountTable.refreshToken, token),
        ),
      );

    if (!account || !user) throw new NotFoundException('Unauthorized user');

    const { accessToken, refreshToken } = await this.generateToken(user);

    await this.databaseService.db
      .update(AccountTable)
      .set({
        refreshToken,
        accessToken,
      })
      .where(eq(AccountTable.id, account.id));

    return {
      accessToken,
      refreshToken,
    };
  }

  async resendVerifyOtp({ id, isVerified }: Account) {
    if (isVerified) throw new ConflictException('User already verified');

    const otp = generateOtp();
    const token = generateToken();

    const [account] = await this.databaseService.db
      .update(AccountTable)
      .set({
        verificationOtp: otp,
        verificationToken: token,
      })
      .where(eq(AccountTable.id, id))
      .returning();

    const [user] = await this.databaseService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, account.userId));

    this.emitter.emit('user.signup', {
      user,
      account,
    });

    return {
      message: 'Resend verification mail',
    };
  }

  async verifyByOtp({ id, isVerified }: Account, otp: string) {
    try {
      if (isVerified) new NotFoundException('User already verified');

      await this.databaseService.db
        .update(AccountTable)
        .set({
          isVerified: true,
          verificationOtp: null,
          verificationToken: null,
        })
        .where(
          and(
            eq(AccountTable.id, id),
            eq(AccountTable.verificationOtp, otp),
            lt(AccountTable.verificationExpires, new Date()),
          ),
        )
        .returning();

      return {
        message: 'otp verified',
      };
    } catch {
      throw new BadRequestException('expired session');
    }
  }

  async verifyByToken(token: string) {
    try {
      await this.databaseService.db
        .update(AccountTable)
        .set({
          isVerified: true,
          verificationOtp: null,
          verificationToken: null,
        })
        .where(
          and(
            eq(AccountTable.verificationToken, token),
            lt(AccountTable.verificationExpires, new Date()),
          ),
        );

      return {
        message: 'ok',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async forgotPassword(email: string) {
    const { account, user } = await this.findByEmail(email);

    if (!account || !user) throw new NotFoundException('Invalid email');

    const [updatedAccount] = await this.databaseService.db
      .update(AccountTable)
      .set({
        passwordResetOtp: generateOtp(),
        passwordResetToken: generateToken(),
      })
      .where(eq(AccountTable.id, account.id))
      .returning();

    this.emitter.emit('user.reset-password', {
      user,
      account: updatedAccount,
    });

    return {
      message: 'Reset otp and link sent your email',
    };
  }

  async checkResetOtp(email: string, otp: string) {
    const { user, account } = await this.findByEmail(email);

    if (!account || !user) throw new NotFoundException('Invalid email');

    if (account.passwordResetOtp !== otp)
      throw new BadRequestException('Invalid otp');

    const [update] = await this.databaseService.db
      .update(AccountTable)
      .set({
        passwordResetOtp: null,
      })
      .where(eq(AccountTable.id, account.id))
      .returning();

    return {
      message: 'success',
      token: update.passwordResetToken,
    };
  }

  async resetByToken(token: string, password: string) {
    const [account] = await this.databaseService.db
      .select()
      .from(AccountTable)
      .where(eq(AccountTable.passwordResetToken, token));
    if (!account) throw new NotFoundException('Invalid token');

    const hashedPassword = await hash(password);

    await this.databaseService.db
      .update(AccountTable)
      .set({
        password: hashedPassword,
        passwordResetToken: null,
      })
      .where(
        and(
          eq(AccountTable.passwordResetToken, token),
          eq(AccountTable.id, account.id),
        ),
      );

    return {
      message: 'Password reset successfully',
    };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.authConfiguration.secret,
        expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      },
    );
  }

  private async generateToken(user: User) {
    const accessToken = await this.signToken(
      user.id,
      this.authConfiguration.expiresIn,
      {
        email: user.email,
        role: user.role,
      },
    );

    const refreshToken = await this.signToken(
      user.id,
      this.authConfiguration.refreshExpiresIn,
    );

    return { accessToken, refreshToken };
  }

  private async findByEmail(email: string) {
    const [result] = await this.databaseService.db
      .select()
      .from(UserTable)
      .leftJoin(AccountTable, eq(UserTable.id, AccountTable.userId))
      .where(eq(UserTable.email, email));

    return {
      ...result,
    };
  }
}
