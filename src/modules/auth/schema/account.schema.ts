import { pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { UserTable } from '../../user/schema/user.schema';

export const AccountTable = pgTable('account', {
  id: varchar({ length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  password: varchar({ length: 255 }),
  otp: varchar({ length: 255 }),
  accessToken: text(),
  refreshToken: text(),
  verificationToken: varchar('verification_token', { length: 255 }),
  passwordResetToken: varchar('password_reset_token', { length: 255 }),
  googleProvider: varchar({ length: 255 }),
  facebookProvider: varchar({ length: 255 }),

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
