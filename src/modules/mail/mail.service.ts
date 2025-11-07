import { Injectable } from '@nestjs/common';
import { createTransport, SentMessageInfo, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import ejs from 'ejs';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE'),
      auth: {
        user: this.configService.get<string>('SMTP_AUTH_USER'),
        pass: this.configService.get<string>('SMTP_AUTH_PASSWORD'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    templateName: string,
    context: ejs.Data = {},
  ): Promise<SentMessageInfo> {
    const templatePath = join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      `${templateName}.ejs`,
    );

    const html: string = await ejs.renderFile(templatePath, context);

    return this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_MAIL_FROM'),
      to,
      subject,
      text,
      html,
    });
  }
}
