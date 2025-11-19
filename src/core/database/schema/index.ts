import { UserTable } from '../../../modules/user/schema/user.schema';
import { SubscriptionTable } from '../../../modules/subscription/schema/subscription.schema';
import { SubscriptionFeatureTable } from '../../../modules/subscription/modules/subscription-features/schema/subscription-feature.schema';
import { SubscriptionPlanTable } from '../../../modules/subscription/modules/subscription-plan/schema/subscription-plan.schema';
import { PaymentTable } from '../../../modules/payment/schema/payment.schema';
import { CouponTable } from '../../../modules/subscription/modules/coupon/schema/coupon.schema';

export const schema = {
  user: UserTable,
  subscription: SubscriptionTable,
  subscriptionPlan: SubscriptionPlanTable,
  subscriptionFeature: SubscriptionFeatureTable,
  payment: PaymentTable,
  coupon: CouponTable,
};
