import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { SignupRequestDto } from './dto/signup.dto';
import { EmailDto } from '../../core/lib/dto/email.dto';
import { ApiBearerAuth, ApiBody, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/signin.dto';
import type { Response } from 'express';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';
import { ActiveAccount } from './decorators/active-email.decorator';
import { type Account } from './schema/account.schema';
import { Roles } from './decorators/role.decorator';

@Controller('auth')
@ApiBearerAuth('jwt')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('otp-verification')
  sendVerification(@Body() body: EmailDto) {}

  @Post('token-verification')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
        },
      },
    },
  })
  verifyEmail(@Body('token') token: string) {}

  @Post('forgot-password')
  @Roles('USER')
  forgotPassword(@Body() body: EmailDto) {
    return { message: 'Password reset link sent to your email' };
  }

  @Post('reset-password')
  resetPassword() {}
}
