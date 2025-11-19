import { CreateSubscriptionPlanDto } from './create-subscription-plan.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSubscriptionPlanDto extends PartialType(
  CreateSubscriptionPlanDto,
) {}
