ALTER TABLE "blog_tag_map" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "blog_tags" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "career_enquiries" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "catalogues" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "videos" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "coupon_redemptions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "coupon_targets" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "coupons" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "subscriptions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "brands" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "inventory_movements" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "product_faqs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "referrals" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_coin_ledger" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "blog_tag_map" CASCADE;--> statement-breakpoint
DROP TABLE "blog_tags" CASCADE;--> statement-breakpoint
DROP TABLE "career_enquiries" CASCADE;--> statement-breakpoint
DROP TABLE "catalogues" CASCADE;--> statement-breakpoint
DROP TABLE "videos" CASCADE;--> statement-breakpoint
DROP TABLE "coupon_redemptions" CASCADE;--> statement-breakpoint
DROP TABLE "coupon_targets" CASCADE;--> statement-breakpoint
DROP TABLE "coupons" CASCADE;--> statement-breakpoint
DROP TABLE "subscriptions" CASCADE;--> statement-breakpoint
DROP TABLE "brands" CASCADE;--> statement-breakpoint
DROP TABLE "inventory_movements" CASCADE;--> statement-breakpoint
DROP TABLE "product_faqs" CASCADE;--> statement-breakpoint
DROP TABLE "referrals" CASCADE;--> statement-breakpoint
DROP TABLE "user_coin_ledger" CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_coupon_id_coupons_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_brand_id_brands_id_fk";
--> statement-breakpoint
DROP INDEX "order_items_product_id_idx";--> statement-breakpoint
DROP INDEX "products_brand_id_idx";--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "tags" varchar[];--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "product_price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "product_image" varchar(220);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipment_provider" varchar DEFAULT 'envia';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tracking_number" varchar;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tracking_url" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipment_status" varchar(80) DEFAULT 'processing' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipment_id" varchar(180);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "courier_name" varchar(160);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "estimated_delivery_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipped_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "delivered_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "address_line_1" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "address_line_2" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "city" varchar(120) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "state" varchar(120) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "postal_code" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "country" varchar(80) DEFAULT 'India' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "total_amount" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "banner_image" text;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "strike_through_price" integer;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "has_variant_box" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "rating" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "review_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "size" varchar(80);--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "color" varchar(80);--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "fabric" varchar(120);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "base_price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "strike_through_price" integer;--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "product_id";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "unit_price_in_paise";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "total_in_paise";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "image_key";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "coupon_id";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "subtotal_in_paise";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "discount_in_paise";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "shipping_in_paise";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "tax_in_paise";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "total_in_paise";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "shipping_full_name";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "shipping_line_1";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "shipping_line_2";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "shipping_city";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "shipping_state";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "shipping_postal_code";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "shipping_country";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "image_key";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "sort_order";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "price_in_paise";--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "compare_at_price_in_paise";--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "low_stock_threshold";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "brand_id";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "base_price_in_paise";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "compare_at_price_in_paise";