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
import { InferEnum, InferInsertModel, relations } from 'drizzle-orm';
import { SubscriptionFeatureTable } from '../../subscription-features/schema/subscription-feature.schema';

export const BillingCycleEnum = pgEnum('billing_cycle_enum', [
  'MONTHLY',
  'YEARLY',
]);

export type BillingCycleEnumType = InferEnum<typeof BillingCycleEnum>;

export const SubscriptionEnum = pgEnum('subscription_type_enum', [
  'STARTER_PLAN',
  'ELITE_PLAN',
  'PRO_PLAN',
]);
export type SubscriptionEnumType = InferEnum<typeof SubscriptionEnum>;

export const SubscriptionPlanTable = pgTable('subscription_plan', {
  id: varchar({ length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar({ length: 128 }).notNull(),
  type: SubscriptionEnum().notNull().unique(),
  discount: text(),
  price: integer().notNull(),
  currency: varchar({ length: 8 }).notNull(),
  billingCycle: BillingCycleEnum().notNull(),

  ...timestamp,
});

export const SubscriptionPlanRelation = relations(
  SubscriptionPlanTable,
  ({ many }) => ({
    features: many(PlanFeatures),
  }),
);

export const PlanFeatures = pgTable(
  'plan_features',
  {
    planId: varchar({ length: 128 })
      .notNull()
      .references(() => SubscriptionPlanTable.id, {
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

export type SubscriptionPlanInsertType = InferInsertModel<
  typeof SubscriptionPlanTable
>;
