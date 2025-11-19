import { CreateSubscriptionFeatureDto } from './create-subscription-feature.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSubscriptionFeatureDto extends PartialType(
  CreateSubscriptionFeatureDto,
) {}
