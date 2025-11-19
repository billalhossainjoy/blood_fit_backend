import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionPlanModule } from './modules/subscription-plan/subscription-plan.module';
import { SubscriptionFeaturesModule } from './modules/subscription-features/subscription-features.module';
import { CouponModule } from './modules/coupon/coupon.module';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  imports: [SubscriptionPlanModule, SubscriptionFeaturesModule, CouponModule],
})
export class SubscriptionModule {}
