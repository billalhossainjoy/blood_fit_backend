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
import { RoleGuard } from './guards/role.guard';
import { AuthListener } from './listeners/auth.listener';
import { MailService } from '../mail/mail.service';

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
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    AuthService,
    UserService,
    DatabaseService,
    JwtService,
    MailService,
    AuthListener,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
