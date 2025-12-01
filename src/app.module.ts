import { Module } from '@nestjs/common';
import { UploadModule } from './modules/upload/upload.module';
import { MailModule } from './modules/mail/mail.module';
import { ConfigModule } from './core/config/config.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PaymentModule } from './modules/payment/payment.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AuthModule,
    ProfileModule,
    UploadModule,
    MailModule,
    ConfigModule,
    UserModule,
    DatabaseModule,
    SubscriptionModule,
    PaymentModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
