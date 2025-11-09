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
import { User } from '../../user/schema/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Unauthorized.');
    }

    const validateUser = await this.jwtService.verifyAsync<User>(token);

    console.log(validateUser);

    return true;
  }
}
