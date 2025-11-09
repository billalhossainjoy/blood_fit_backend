import { pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { InferEnum, InferSelectModel, relations } from 'drizzle-orm';
import { AccountTable } from '../../auth/schema/account.schema';

export const UserRole = pgEnum('UserRole', ['ADMIN', 'USER']);

export const UserTable = pgTable('user', {
  id: varchar({ length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  firstName: varchar('first_name', { length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  lastName: varchar('last_name', { length: 255 }),
  contactNumber: varchar('contact_number', { length: 255 }),
  role: UserRole().default('USER').notNull(),
});

export const UserRelation = relations(UserTable, ({ one }) => ({
  account: one(AccountTable, {
    fields: [UserTable.id],
    references: [AccountTable.userId],
  }),
}));

export type User = InferSelectModel<typeof UserTable>;
export type UserRole = InferEnum<typeof UserRole>;
