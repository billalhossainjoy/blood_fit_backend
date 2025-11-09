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
import { User, UserTable } from '../../user/schema/user.schema';
import { JwtPayload } from 'jsonwebtoken';
import { DatabaseService } from '../../../core/database/database.service';
import { AccountTable } from '../schema/account.schema';
import { eq } from 'drizzle-orm';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/allow-anonymous.decorator';

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

    if (!token) {
      throw new UnauthorizedException('Unauthorized.');
    }

    let validateUser: JwtPayload;

    try {
      validateUser = (await this.jwtService.verifyAsync<User>(
        token,
        this.authConfiguration,
      )) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Unauthorized.');
    }

    if (!validateUser || !validateUser?.sub) {
      throw new UnauthorizedException('Unauthorized.');
    }

    const [result] = await this.databaseService.db
      .select()
      .from(AccountTable)
      .where(eq(AccountTable.id, validateUser.sub))
      .leftJoin(UserTable, eq(AccountTable.userId, UserTable.id));

    if (!result.user || !result.account) {
      throw new UnauthorizedException('Unauthorized.');
    }

    if (!result.account.accessToken || result.account.accessToken !== token) {
      throw new UnauthorizedException('Unauthorized.');
    }

    request.user = result.user;
    request.account = result.account;

    return true;
  }
}
