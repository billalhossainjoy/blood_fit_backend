import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { UserTable } from '../../user/schema/user.schema';

export const AccountTable = pgTable('account', {
  id: varchar({ length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  password: varchar({ length: 255 }),
  accessToken: text(),
  refreshToken: text(),
  verificationOtp: varchar({ length: 6 }),
  verificationToken: varchar('verification_token', { length: 64 }),
  verificationExpires: timestamp('verification_expires'),

  passwordResetOtp: varchar({ length: 6 }),
  passwordResetToken: varchar('password_reset_token', { length: 64 }),
  passwordResetExpires: timestamp('password_reset_expires'),

  googleProvider: varchar({ length: 255 }),
  facebookProvider: varchar({ length: 255 }),

  isVerified: boolean(),

  userId: varchar({ length: 255 })
    .references(() => UserTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
});

export const AccountRelation = relations(AccountTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [AccountTable.userId],
    references: [UserTable.id],
  }),
}));

export type Account = typeof AccountTable.$inferSelect;
