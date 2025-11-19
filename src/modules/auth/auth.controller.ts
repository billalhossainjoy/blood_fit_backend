import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { SignupRequestDto } from './dto/signup.dto';
import { EmailDto } from '../../core/lib/dto/email.dto';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/signin.dto';
import type { Response } from 'express';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';
import { ActiveAccount } from './decorators/active-email.decorator';
import { type Account } from './schema/account.schema';
import { Roles } from './decorators/role.decorator';
import { ForgottenOtpRequestDto, ResetPasswordDto } from './dto/forgotten.dto';
import authConfig from './config/auth.config';
import type { ConfigType } from '@nestjs/config';
import { UnVerified } from './decorators/unverified.decorator';
import { ActiveUser } from './decorators/active-user.decorator';
import { type User } from '../user/schema/user.schema';

@Controller('auth')
@ApiBearerAuth('jwt')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  @AllowAnonymous()
  @Post('signup')
  async signup(
    @Body() signupRequestDto: SignupRequestDto,
    @Res() res: Response,
  ) {
    const { user, refreshToken, accessToken } =
      await this.authService.signup(signupRequestDto);

    res.setHeader('access-token', accessToken);
    res.setHeader('refresh-token', refreshToken);

    res.json({
      message: 'User created successfully',
      user,
    });
  }

  @AllowAnonymous()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() signInRequestDto: SignInRequestDto,
    @Res() res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.signIn(signInRequestDto);

    res.setHeader('access-token', accessToken);
    res.setHeader('refresh-token', refreshToken);

    res.json({
      message: 'User logged in successfully',
      user,
    });
  }

  @Post('logout')
  logout(@ActiveAccount() account: Account) {
    return this.authService.logout(account);
  }

  @AllowAnonymous()
  @Post('refresh-token')
  @ApiHeader({
    name: 'refresh-token',
    description: 'Refresh token',
    required: true,
  })
  async refreshToken(
    @Headers('refresh-token') token: string,
    @Res() res: Response,
  ) {
    const { refreshToken, accessToken } =
      await this.authService.refreshToken(token);

    res.setHeader('access-token', accessToken);
    res.setHeader('refresh-token', refreshToken);
    res.json({ message: 'Token refreshed successfully' });
  }

  @Get('verify/resend')
  @UnVerified()
  resendOtp(@ActiveAccount() account: Account) {
    return this.authService.resendVerifyOtp(account);
  }

  @Get('verify/otp/:otp')
  verificationByOtp(
    @Param('otp') otp: string,
    @ActiveAccount() account: Account,
  ) {
    return this.authService.verifyByOtp(account, otp);
  }

  @Get('verify/token/:token')
  @AllowAnonymous()
  async verificationByToken(
    @Param('token') token: string,
    @Res() res: Response,
  ) {
    await this.authService.verifyByToken(token);

    return res.redirect('/');
  }

  @Post('forgot-password')
  @AllowAnonymous()
  forgotPassword(@Body() { email }: EmailDto) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password-otp')
  @AllowAnonymous()
  resetByOTP(@Body() { otp, email }: ForgottenOtpRequestDto) {
    return this.authService.checkResetOtp(email, otp);
  }

  @Post('reset-password')
  @Roles('USER')
  @AllowAnonymous()
  resetByToken(@Body() { token, password }: ResetPasswordDto) {
    return this.authService.resetByToken(token, password);
  }

  @Get('profile')
  getProfile(@ActiveUser() user: User) {
    return user;
  }
}
