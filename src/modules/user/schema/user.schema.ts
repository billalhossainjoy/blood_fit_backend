import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const UserTable = pgTable('users', {
  id: varchar({ length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  contactNumber: varchar('contact_number', { length: 255 }),
  password: varchar({ length: 255 }),
  otp: varchar({ length: 255 }),
  verificationToken: varchar('verification_token', { length: 255 }),
  passwordResetToken: varchar('password_reset_token', { length: 255 }),
  googleProvider: varchar({ length: 255 }),
  facebookProvider: varchar({ length: 255 }),
});
