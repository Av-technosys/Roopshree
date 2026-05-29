CREATE TYPE "public"."customer_contact_type" AS ENUM('newsletter', 'enquiry');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "customer_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"type" "customer_contact_type" NOT NULL,
	"full_name" varchar(160),
	"phone" varchar(20),
	"category" varchar(120),
	"subject" varchar(180),
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "reviews_approved_idx";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "rating" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "review_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "status" "review_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
CREATE INDEX "customer_contacts_type_idx" ON "customer_contacts" USING btree ("type");--> statement-breakpoint
CREATE INDEX "customer_contacts_email_idx" ON "customer_contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "reviews_status_idx" ON "reviews" USING btree ("status");--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "rating";--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "review_count";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "is_approved";