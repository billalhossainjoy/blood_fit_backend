CREATE TYPE "public"."blood_type" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
CREATE TABLE "information_gather" (
	"id" varchar(128),
	"blood_type" "blood_type" NOT NULL,
	"gender" "gender" NOT NULL,
	"age" integer NOT NULL,
	"weight" integer NOT NULL,
	"height" integer NOT NULL,
	"country" varchar(128) NOT NULL,
	"diet" varchar(255) NOT NULL,
	"food_allergies" text NOT NULL,
	"food_dislikes" text NOT NULL,
	"calorie_intake" text,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"contact_name" varchar(255),
	"password" varchar(255),
	"otp" varchar(255),
	"verification_token" varchar(255),
	"password_resent_token" varchar(255),
	"googleProvider" varchar(255),
	"facebookProvider" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "information_gather" ADD CONSTRAINT "information_gather_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;