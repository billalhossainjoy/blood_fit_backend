import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({
    description: 'Email address',
    example: 'john@doe.com',
  })
  @IsEmail()
  email: string;
}
