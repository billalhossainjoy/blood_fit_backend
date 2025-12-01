import { integer, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export enum BodyShape {
  Medium = 'medium',
  Flabby = 'flabby',
  Skinny = 'skinny',
  Muscular = 'muscular',
}
export const BodyShapeEnum = pgEnum('bodyShape', BodyShape);

export enum ActivityLevel {
  Sedentary = 'Sedentary',
  LightActivity = 'Light Activity',
  ModeratelyActive = 'Moderately Active',
  VeryActive = 'Very Active',
}
export const ActivityLevelEnum = pgEnum('activityLevel', ActivityLevel);

export enum WorkoutLevel {
  EasyToStart = 'Easy to start',
  BreakALittleSweat = 'Break a little sweat',
  Challenging = 'Challenging',
}
export const WorkoutLevelEnum = pgEnum('workoutLevel', WorkoutLevel);

export enum Goal {
  LooseWeight = 'Loose Weight',
  GainMuscle = 'Gain Muscle',
}
export const GoalLevelEnum = pgEnum('goalLevel', Goal);

export enum FocusBodyArea {
  Arms = 'Arms',
  UpperBody = 'Upper Body',
  Abs = 'Abs',
  Butt = 'Butt',
  Legs = 'Legs',
}
export const FocusBodyAreaEnum = pgEnum('focusBodyArea', FocusBodyArea);

export const FitnessTable = pgTable('fitness', {
  id: varchar({ length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  bodyShape: BodyShapeEnum(),
  activityLevel: ActivityLevelEnum(),
  workoutLevel: WorkoutLevelEnum(),
  goal: GoalLevelEnum(),
  weight: integer(),
  focusBodyArea: FocusBodyAreaEnum(),
});
