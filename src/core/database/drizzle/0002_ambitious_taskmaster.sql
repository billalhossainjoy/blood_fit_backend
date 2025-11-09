CREATE TYPE "public"."UserRole" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "accessToken" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "refreshToken" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "UserRole" DEFAULT 'USER' NOT NULL;