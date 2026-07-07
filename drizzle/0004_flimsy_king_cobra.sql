ALTER TABLE "reviews" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."review_status";--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."review_status";--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "status" SET DATA TYPE "public"."review_status" USING "status"::"public"."review_status";--> statement-breakpoint
DROP INDEX "product_variants_sku_idx";--> statement-breakpoint
CREATE INDEX "product_variants_sku_idx" ON "product_variants" USING btree ("sku");