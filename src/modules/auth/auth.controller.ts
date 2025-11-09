import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { SignupRequestDto } from './dto/signup.dto';
import { EmailDto } from '../../core/lib/dto/email.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/signin.dto';
import { type Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
@ApiBearerAuth('jwt')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() signupRequestDto: SignupRequestDto,
    @Res() res: Response,
  ) {
    const { data, refreshToken, accessToken } =
      await this.authService.signup(signupRequestDto);

    res.setHeader('access-token', accessToken);
    res.setHeader('refresh-token', refreshToken);

    res.json({
      ...data,
    });
  }

  @Post('login')
  async login(
    @Body() signInRequestDto: SignInRequestDto,
    @Res() res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.signIn(signInRequestDto);

    res.setHeader('access-token', accessToken);
    res.setHeader('refresh-token', refreshToken);

    res.json(user);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout() {}

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
  forgotPassword(@Body() body: EmailDto) {}

  @Post('reset-password')
  resetPassword() {}
}
