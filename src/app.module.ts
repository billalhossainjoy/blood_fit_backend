import { Module } from '@nestjs/common';
import { UploadModule } from './modules/upload/upload.module';
import { MailModule } from './modules/mail/mail.module';
import { ConfigModule } from './core/config/config.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    UploadModule,
    MailModule,
    ConfigModule,
    UserModule,
    DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}
