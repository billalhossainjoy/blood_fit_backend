import { pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export enum Diet {
  Classic = 'classic',
  Vegan = 'vegan',
  pescatarian = 'pescatarian',
  Carnivore = 'carnivore',
  Vegetarian = 'Vegetarian',
}
export const DietEnum = pgEnum('Diet', Diet);

export enum WeekDay {
  'SAT' = 'sat',
  'SUN' = 'SUN',
  'MON' = 'Mon',
  'TUES' = 'TUES',
  'WED' = 'WED',
  'THUR' = 'THUR',
  'FRI' = 'FRI',
}
export const WeekDaysEnum = pgEnum('week_days', WeekDay);

export const MealPlanTable = pgTable('mealplan', {
  id: varchar({ length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  diet: varchar(),
  mealPlanDays: WeekDaysEnum().array().default([]),
  cheatDays: WeekDaysEnum().default(WeekDay.FRI),
  Allergies: varchar().array().default([]),
  dislikes: varchar().array().default([]),
});
