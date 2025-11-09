import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'john@doe.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: '01516500653',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  phone: string;

  @ApiProperty({
    example: '12345678',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
