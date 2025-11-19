import { pgTable, time, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { UserTable } from '../../user/schema/user.schema';
import { SubscriptionFeatureTable } from '../modules/subscription-features/schema/subscription-feature.schema';
import { BillingCycleEnum } from '../modules/subscription-plan/schema/subscription-plan.schema';
import { timestamps } from '../../../core/common/schema/columns.helpers';

export const SubscriptionTable = pgTable('subscription', {
  id: varchar({ length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: varchar({ length: 128 }).references(() => UserTable.id),
  planId: varchar({ length: 128 }).references(
    () => SubscriptionFeatureTable.id,
  ),
  startDate: time().defaultNow().notNull(),
  endDate: time().defaultNow().notNull(),
  billingCycle: BillingCycleEnum().notNull(),

  ...timestamps,
});
