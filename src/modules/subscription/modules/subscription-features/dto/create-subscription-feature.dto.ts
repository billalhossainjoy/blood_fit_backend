import { SubscriptionFeatureType } from '../schema/subscription-feature.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateSubscriptionFeatureDto implements SubscriptionFeatureType {
  @ApiProperty({
    example: 'First features',
  })
  @IsString()
  @MaxLength(255)
  name: string;
}
