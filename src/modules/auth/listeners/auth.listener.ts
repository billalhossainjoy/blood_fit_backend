import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../../mail/mail.service';
import { User } from '../../user/schema/user.schema';
import { Account } from '../schema/account.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthListener {
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}
  @OnEvent('user.signup')
  async VerificationMail(payload: { user: User; account: Account }) {
    await this.mailService.sendMail(
      payload.user.email,
      'Email Verification',
      'please verify your mail to active your account ',
      'verify',
      {
        name: payload.user.firstName + ' ' + payload.user.lastName,
        otp: payload.account.verificationOtp,
        url: `${this.configService.get('API_URL')}/api/auth/verify/token/${payload.account.verificationToken}`,
      },
    );
  }

  @OnEvent('user.reset-password')
  async ResetMail(payload: { user: User; account: Account }) {
    await this.mailService.sendMail(
      payload.user.email,
      'Forgotten Password',
      'You or otp to reset you password or click link to reset your password',
      'reset_password',
      {
        name: payload.user.firstName + ' ' + payload.user.lastName,
        otp: payload.account.passwordResetOtp,
        url: `${this.configService.get('API_URL')}/api/auth/verify/token/${payload.account.passwordResetToken}`,
      },
    );
  }
}
