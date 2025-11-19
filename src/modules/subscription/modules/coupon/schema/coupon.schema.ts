import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { timestamps } from '../../../../../core/common/schema/columns.helpers';
import { InferEnum, InferInsertModel } from 'drizzle-orm';

export const CouponEnum = pgEnum('coupon_type', ['PERCENTAGE', 'FIXED']);

export const CouponTable = pgTable('coupon', {
  id: varchar({ length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  code: varchar({ length: 32 }).notNull(),
  description: varchar({ length: 64 }).notNull(),
  discountType: CouponEnum().notNull(),
  percentage: integer(),
  amountOff: integer(),

  startDate: timestamp().notNull(),
  endDate: timestamp().notNull(),
  isActive: boolean().default(true),

  ...timestamps,
});

export type CouponInsertType = InferInsertModel<typeof CouponTable>;
export type CouponEnumType = InferEnum<typeof CouponEnum>;
