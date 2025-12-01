import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { InferEnum, InferSelectModel, relations } from 'drizzle-orm';
import { AccountTable } from '../../auth/schema/account.schema';

export const UserRole = pgEnum('UserRole', ['ADMIN', 'USER']);
export const bloodTypeEnum = pgEnum('blood_type', [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
]);

export const genderEnum = pgEnum('gender', ['MALE', 'FEMALE']);

export const WeightUnit = pgEnum('WeightUnit', ['KG', 'IB']);

export const UserTable = pgTable('user', {
  id: varchar({ length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  firstName: varchar('first_name', { length: 255 }),
  image: text('image'),
  lastName: varchar('last_name', { length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  contactNumber: varchar('contact_number', { length: 255 }),
  role: UserRole().default('USER').notNull(),
  bloodType: bloodTypeEnum('blood_type'),
  gender: genderEnum(),
  age: integer(),
  weight: integer(),
  height: integer(),
  country: varchar({ length: 128 }),
  diet: varchar({ length: 255 }),
  foodAllergies: text('food_allergies'),
  footDislikes: text('food_dislikes'),
  calorieIntake: text('calorie_intake'),

  ...timestamp,
});

export const UserRelation = relations(UserTable, ({ one }) => ({
  account: one(AccountTable, {
    fields: [UserTable.id],
    references: [AccountTable.userId],
  }),
}));

export type User = InferSelectModel<typeof UserTable>;
export type UserRoleType = InferEnum<typeof UserRole>;
export type BloodType = InferEnum<typeof bloodTypeEnum>;
export type GenderType = InferEnum<typeof genderEnum>;
