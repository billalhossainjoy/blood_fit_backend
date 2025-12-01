import { SubscriptionInsertType } from '../schema/subscription.schema';
import {
  BillingCycleEnum,
  type BillingCycleEnumType,
} from '../modules/subscription-plan/schema/subscription-plan.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSubscriptionDto implements SubscriptionInsertType {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  planId: string;

  @ApiProperty({
    example: new Date(),
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => new Date(value))
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: new Date(),
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => new Date(value))
  @IsDate()
  endDate: Date;

  @ApiProperty({
    enum: BillingCycleEnum.enumValues,
    enumName: BillingCycleEnum.name,
  })
  @IsNotEmpty()
  @IsEnum(BillingCycleEnum.enumValues)
  billingCycle: BillingCycleEnumType;
}
