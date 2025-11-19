import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { type Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { type ConfigType } from '@nestjs/config';
import authConfig from '../config/auth.config';
import { UserTable } from '../../user/schema/user.schema';
import { DatabaseService } from '../../../core/database/database.service';
import { AccountTable } from '../schema/account.schema';
import { eq } from 'drizzle-orm';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/allow-anonymous.decorator';
import { IS_VERIFIED } from '../decorators/unverified.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    private readonly databaseService: DatabaseService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Unauthorized.');

    let validateUser: { sub: string };

    try {
      validateUser = await this.jwtService.verifyAsync<{ sub: string }>(token, {
        secret: this.authConfiguration.secret,
      });
    } catch {
      throw new UnauthorizedException('Unauthorized.');
    }

    if (!validateUser || !validateUser.sub)
      throw new UnauthorizedException('Unauthorized.');

    const [result] = await this.databaseService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, validateUser.sub))
      .leftJoin(AccountTable, eq(AccountTable.userId, UserTable.id));

    if (!result.user || !result.account)
      throw new UnauthorizedException('Unauthorized.');

    if (!result.account.accessToken || result.account.accessToken !== token)
      throw new UnauthorizedException('Unauthorized.');

    request.user = result.user;
    request.account = result.account;

    const isUnVerified = this.reflector.getAllAndOverride<boolean>(
      IS_VERIFIED,
      [context.getHandler(), context.getClass()],
    );

    if (isUnVerified) return true;

    if (!result.account.isVerified)
      throw new UnauthorizedException('User not verified');

    return true;
  }
}
