import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

export class OtpVerificationRequestDto {
  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  otp: string;
}

export class TokenVerificationRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}
