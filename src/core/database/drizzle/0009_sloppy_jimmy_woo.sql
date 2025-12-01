CREATE TYPE "public"."subscription_type_enum" AS ENUM('STARTER_PLAN', 'ELITE_PLAN', 'PRO_PLAN');--> statement-breakpoint
CREATE TYPE "public"."WeightUnit" AS ENUM('KG', 'IB');--> statement-breakpoint
CREATE TYPE "public"."blood_type" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
ALTER TABLE "subscription_plan" ADD COLUMN "type" "subscription_type_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "blood_type" "blood_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "gender" "gender";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "age" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "weight" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "height" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "country" varchar(128);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "diet" varchar(255);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "food_allergies" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "food_dislikes" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "calorie_intake" text;--> statement-breakpoint
ALTER TABLE "subscription_plan" ADD CONSTRAINT "subscription_plan_type_unique" UNIQUE("type");