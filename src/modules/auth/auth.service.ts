import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';
import { Account, AccountTable } from './schema/account.schema';
import { and, eq } from 'drizzle-orm';
import { SignupRequestDto } from './dto/signup.dto';
import { hash, verify } from 'argon2';
import { User, UserTable } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { SignInRequestDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, type ConfigType } from '@nestjs/config';
import authConfig from './config/auth.config';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
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

      await tx
        .insert(AccountTable)
        .values({
          id: accountId,
          password: hashedPassword,
          userId: user.id,
          accessToken,
          refreshToken,
        })
        .returning();

      return { user, accessToken, refreshToken };
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

    return { user, accessToken, refreshToken };
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

    return { message: 'User logged out successfully' };
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
          eq(AccountTable.id, decoded.sub),
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
