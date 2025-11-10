ALTER TABLE "account" ADD COLUMN "verificationOtp" varchar(6);--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "verificationExpires" varchar(64);--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "passwordResetOtp" varchar(6);--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "otp";