import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import {
  type BloodType,
  bloodTypeEnum,
  genderEnum,
  type GenderType,
} from '../../user/schema/user.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === 'string' ? undefined : String(value),
  )
  firstName?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === 'string' ? undefined : String(value),
  )
  lastName?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === 'string' ? undefined : String(value),
  )
  email?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  avatar?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' || value === 'string' ? undefined : String(value),
  )
  contactNumber?: string;

  @ApiProperty({
    required: false,
    enum: bloodTypeEnum.enumValues,
    enumName: bloodTypeEnum.name,
  })
  @IsOptional()
  @IsEnum(bloodTypeEnum.enumValues)
  bloodType?: BloodType;

  @ApiProperty({
    required: false,
    enum: genderEnum.enumValues,
    enumName: genderEnum.name,
  })
  @IsOptional()
  @IsEnum(genderEnum.enumValues)
  gender?: GenderType;

  @ApiProperty({
    required: false,
    type: 'number',
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value === 0 ? undefined : Number(value)))
  age?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value === 0 ? undefined : Number(value)))
  weight?: number;

  @ApiProperty({
    required: false,
    type: 'number',
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value === 0 ? undefined : Number(value)))
  height?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' || value === 'string' ? undefined : String(value),
  )
  country?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' || value === 'string' ? undefined : String(value),
  )
  diet?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' || value === 'string' ? undefined : String(value),
  )
  foodAllergies?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' || value === 'string' ? undefined : String(value),
  )
  footDislikes?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' || value === 'string' ? undefined : String(value),
  )
  calorieIntake?: string;
}
