ALTER TABLE "account" ALTER COLUMN "verification_token" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "password_reset_token" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "verification_expires" timestamp;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "password_reset_expires" timestamp;--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "verificationExpires";