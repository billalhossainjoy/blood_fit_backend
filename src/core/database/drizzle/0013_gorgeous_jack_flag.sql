CREATE TYPE "public"."activityLevel" AS ENUM('Sedentary', 'Light Activity', 'Moderately Active', 'Very Active');--> statement-breakpoint
CREATE TYPE "public"."bodyShape" AS ENUM('medium', 'flabby', 'skinny', 'muscular');--> statement-breakpoint
CREATE TYPE "public"."focusBodyArea" AS ENUM('Arms', 'Upper Body', 'Abs', 'Butt', 'Legs');--> statement-breakpoint
CREATE TYPE "public"."goalLevel" AS ENUM('Loose Weight', 'Gain Muscle');--> statement-breakpoint
CREATE TYPE "public"."workoutLevel" AS ENUM('Easy to start', 'Break a little sweat', 'Challenging');--> statement-breakpoint
CREATE TYPE "public"."Diet" AS ENUM('classic', 'vegan', 'pescatarian', 'carnivore', 'Vegetarian');--> statement-breakpoint
CREATE TYPE "public"."week_days" AS ENUM('sat', 'SUN', 'Mon', 'TUES', 'WED', 'THUR', 'FRI');--> statement-breakpoint
CREATE TABLE "fitness" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"bodyShape" "bodyShape",
	"activityLevel" "activityLevel",
	"workoutLevel" "workoutLevel",
	"goal" "goalLevel",
	"weight" integer,
	"focusBodyArea" "focusBodyArea"
);
--> statement-breakpoint
CREATE TABLE "mealplan" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"diet" varchar,
	"mealPlanDays" "week_days"[] DEFAULT '{}',
	"cheatDays" "week_days" DEFAULT 'FRI',
	"Allergies" varchar[] DEFAULT '{}',
	"dislikes" varchar[] DEFAULT '{}'
);
