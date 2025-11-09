import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

export class OtpValidationRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  otp: number;
}

export class TokenValidationRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}
