import { decimal, pgTable, time, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { UserTable } from '../../user/schema/user.schema';
import { SubscriptionFeatureTable } from '../../subscription/modules/subscription-features/schema/subscription-feature.schema';
import { timestamps } from '../../../core/common/schema/columns.helpers';

export const PaymentTable = pgTable('payment', {
  id: varchar({ length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: varchar({ length: 128 }).references(() => UserTable.id),
  amount: decimal({ scale: 2 }),
  subscriptionId: varchar({ length: 128 })
    .references(() => SubscriptionFeatureTable.id)
    .notNull(),
  currency: varchar({ length: 8 }),
  paymentMethod: varchar({ length: 64 }),
  paymentDate: time().defaultNow(),

  ...timestamps,
});
