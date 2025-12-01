import {
  BillingCycleEnum,
  type BillingCycleEnumType,
  SubscriptionEnum,
  type SubscriptionEnumType,
  type SubscriptionPlanInsertType,
} from '../schema/subscription-plan.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubscriptionPlanDto implements SubscriptionPlanInsertType {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    enum: SubscriptionEnum.enumValues,
    enumName: SubscriptionEnum.name,
  })
  @IsNotEmpty()
  @IsEnum(SubscriptionEnum.enumValues)
  type: SubscriptionEnumType;

  @ApiProperty()
  @IsString()
  discount: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty({
    enum: BillingCycleEnum.enumValues,
    enumName: BillingCycleEnum.name,
  })
  @IsEnum(BillingCycleEnum.enumValues)
  billingCycle: BillingCycleEnumType;
}
