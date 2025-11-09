CREATE TABLE "account" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"otp" varchar(255),
	"verification_token" varchar(255),
	"password_reset_token" varchar(255),
	"googleProvider" varchar(255),
	"facebookProvider" varchar(255),
	"userId" varchar(255),
	CONSTRAINT "account_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"contact_number" varchar(255)
);
--> statement-breakpoint
DROP TABLE "information_gather" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."blood_type";--> statement-breakpoint
DROP TYPE "public"."gender";