import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { SubscriptionFeatureTable } from '../../subscription-features/schema/subscription-feature.schema';

export const BillingCycleEnum = pgEnum('billing_cycle_enum', [
  'MONTHLY',
  'YEARLY',
]);

export const SubscriptionPlan = pgTable('subscription_plan', {
  id: varchar({ length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar({ length: 128 }).notNull(),
  discount: text(),
  price: integer().notNull(),
  currency: varchar({ length: 8 }).notNull(),
  billingCycle: BillingCycleEnum().notNull(),

  ...timestamp,
});

export const SubscriptionPlanRelation = relations(
  SubscriptionPlan,
  ({ many }) => ({
    features: many(PlanFeatures),
  }),
);

export const PlanFeatures = pgTable(
  'plan_features',
  {
    planId: varchar({ length: 128 })
      .notNull()
      .references(() => SubscriptionPlan.id, {
        onDelete: 'cascade',
      }),
    featureId: varchar({ length: 128 })
      .notNull()
      .references(() => SubscriptionFeatureTable.id),

    isActive: boolean().default(false),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.planId, table.featureId] }),
  }),
);
