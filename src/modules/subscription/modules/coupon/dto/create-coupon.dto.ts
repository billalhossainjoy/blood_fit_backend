import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  CouponEnum,
  type CouponEnumType,
  CouponInsertType,
} from '../schema/coupon.schema';
import { Type } from 'class-transformer';

export class CreateCouponDto implements CouponInsertType {
  @ApiProperty({
    example: 'j23jsl3234f',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  description: string;

  @ApiProperty({
    enum: CouponEnum.enumValues,
  })
  @IsNotEmpty()
  @IsEnum(CouponEnum.enumValues)
  discountType: CouponEnumType;

  @ApiProperty({
    example: '10',
  })
  @IsNumber()
  percentage: number;

  @ApiProperty()
  @IsNumber()
  amountOff: number;

  @ApiProperty({ example: '2025-12-31T23:59:59Z' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: '2026-12-31T23:59:59Z' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
