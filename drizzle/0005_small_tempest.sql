CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "instagram_link" varchar;--> statement-breakpoint
CREATE UNIQUE INDEX "subscriptions_email_idx" ON "subscriptions" USING btree ("email");