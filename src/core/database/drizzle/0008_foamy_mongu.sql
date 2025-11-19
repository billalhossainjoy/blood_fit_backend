CREATE TYPE "public"."coupon_type" AS ENUM('PERCENTAGE', 'FIXED');--> statement-breakpoint
CREATE TYPE "public"."billing_cycle_enum" AS ENUM('MONTHLY', 'YEARLY');--> statement-breakpoint
CREATE TABLE "payment" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"userId" varchar(128),
	"amount" numeric,
	"subscriptionId" varchar(128) NOT NULL,
	"currency" varchar(8),
	"paymentMethod" varchar(64),
	"paymentDate" time DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "coupon" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"code" varchar(32) NOT NULL,
	"description" varchar(64) NOT NULL,
	"discountType" "coupon_type" NOT NULL,
	"percentage" integer,
	"amountOff" integer,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp NOT NULL,
	"isActive" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "subscription_features" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "plan_features" (
	"planId" varchar(128) NOT NULL,
	"featureId" varchar(128) NOT NULL,
	"isActive" boolean DEFAULT false,
	CONSTRAINT "plan_features_planId_featureId_pk" PRIMARY KEY("planId","featureId")
);
--> statement-breakpoint
CREATE TABLE "subscription_plan" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"discount" text,
	"price" integer NOT NULL,
	"currency" varchar(8) NOT NULL,
	"billingCycle" "billing_cycle_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"userId" varchar(128),
	"planId" varchar(128),
	"startDate" time DEFAULT now() NOT NULL,
	"endDate" time DEFAULT now() NOT NULL,
	"billingCycle" "billing_cycle_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_subscriptionId_subscription_features_id_fk" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscription_features"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_planId_subscription_plan_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."subscription_plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_featureId_subscription_features_id_fk" FOREIGN KEY ("featureId") REFERENCES "public"."subscription_features"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_planId_subscription_features_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."subscription_features"("id") ON DELETE no action ON UPDATE no action;