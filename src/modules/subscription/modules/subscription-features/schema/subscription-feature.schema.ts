import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { InferInsertModel, relations } from 'drizzle-orm';
import { PlanFeatures } from '../../subscription-plan/schema/subscription-plan.schema';

export const SubscriptionFeatureTable = pgTable('subscription_features', {
  id: varchar({ length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar({ length: 255 }),

  ...timestamp,
});

export const SubscriptionFeaturesRelation = relations(
  SubscriptionFeatureTable,
  ({ many }) => ({
    plans: many(PlanFeatures),
  }),
);

export type SubscriptionFeatureType = InferInsertModel<
  typeof SubscriptionFeatureTable
>;
