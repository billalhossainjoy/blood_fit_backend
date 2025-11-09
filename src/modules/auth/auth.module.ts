import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { DatabaseService } from '../../core/database/database.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import authConfig from './config/auth.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    UserService,
    DatabaseService,
    JwtService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
