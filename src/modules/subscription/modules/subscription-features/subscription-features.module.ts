import { Module } from '@nestjs/common';
import { SubscriptionFeaturesService } from './subscription-features.service';
import { SubscriptionFeaturesController } from './subscription-features.controller';

@Module({
  controllers: [SubscriptionFeaturesController],
  providers: [SubscriptionFeaturesService],
})
export class SubscriptionFeaturesModule {}
