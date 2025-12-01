ALTER TABLE "subscription" ALTER COLUMN "startDate" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "subscription" ALTER COLUMN "startDate" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "subscription" ALTER COLUMN "endDate" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "subscription" ALTER COLUMN "endDate" SET DEFAULT now();