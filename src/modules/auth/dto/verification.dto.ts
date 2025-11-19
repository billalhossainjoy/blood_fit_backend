import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

export class OtpVerificationRequestDto {
  @ApiProperty({
    example: 'http://localhost:3000',
  })
  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  redirectUrl: string;
}

export class TokenVerificationRequestDto {
  @ApiProperty({
    example: 'http://localhost:3000',
  })
  @IsNotEmpty()
  @IsString()
  redirectUrl: string;
}
