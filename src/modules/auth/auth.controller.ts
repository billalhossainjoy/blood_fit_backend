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
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupRequestDto } from './dto/signup.dto';
import { EmailDto } from '../../core/lib/dto/email.dto';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/signin.dto';
import type { CookieOptions, Request, Response } from 'express';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';
import { ActiveAccount } from './decorators/active-email.decorator';
import { type Account } from './schema/account.schema';
import { Roles } from './decorators/role.decorator';
import { ForgottenOtpRequestDto, ResetPasswordDto } from './dto/forgotten.dto';
import authConfig from './config/auth.config';
import type { ConfigType } from '@nestjs/config';
import { UnVerified } from './decorators/unverified.decorator';
import appConfig from '../../core/config/app.config';
import { NODE_ENV } from '../../core/config/config.schema';

@Controller('auth')
@ApiBearerAuth('jwt')
export class AuthController {
  private readonly RefreshTokenCookieOption: CookieOptions = {};

  constructor(
    private readonly authService: AuthService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
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

    res.cookie('access-token', accessToken, this.accessTokenCookieOption());
    res.cookie('refresh-token', refreshToken, this.refreshTokenCookieOption());

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

    res.cookie('access-token', accessToken, this.accessTokenCookieOption());
    res.cookie('refresh-token', refreshToken, this.refreshTokenCookieOption());

    res.json({
      message: 'User logged in successfully',
      user,
    });
  }

  @Post('logout')
  async logout(@ActiveAccount() account: Account, @Res() res: Response) {
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');

    await this.authService.logout(account);

    res.json({
      message: 'User logged out successfully',
    });
  }

  @AllowAnonymous()
  @Get('refresh-token')
  @ApiHeader({
    name: 'refresh-token',
    description: 'Refresh token',
  })
  async refreshToken(
    @Headers('refresh-token') currentRefreshToken: string | undefined,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token =
      currentRefreshToken ?? (req.cookies['refresh-token'] as string);

    if (!token) throw new UnauthorizedException('Unauthorized.');
    const { refreshToken, accessToken } =
      await this.authService.refreshToken(token);

    res.setHeader('access-token', accessToken);
    res.setHeader('refresh-token', refreshToken);

    res.cookie('access-token', accessToken, this.accessTokenCookieOption());
    res.cookie('refresh-token', refreshToken, this.refreshTokenCookieOption());

    res.json({ message: 'Token refreshed successfully' });
  }

  @Get('verify/resend')
  @UnVerified()
  resendOtp(@ActiveAccount() account: Account) {
    return this.authService.resendVerifyOtp(account);
  }

  @Get('verify/otp/:otp')
  @UnVerified()
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

  private accessTokenCookieOption(): CookieOptions {
    return {
      httpOnly: this.appConfiguration.NODE_ENV === NODE_ENV.production,
      secure: true,
      path: '/',
    };
  }

  private refreshTokenCookieOption(): CookieOptions {
    return {
      httpOnly: this.appConfiguration.NODE_ENV === NODE_ENV.production,
      secure: true,
      path: '/api/auth/refresh-token',
    };
  }
}
