ALTER TABLE "product_media" DROP CONSTRAINT IF EXISTS "product_media_product_id_media_asset_id_pk";--> statement-breakpoint
UPDATE "product_media" AS "pm"
SET "variant_id" = COALESCE(
	(
		SELECT "pv"."id"
		FROM "product_variants" AS "pv"
		WHERE "pv"."product_id" = "pm"."product_id"
			AND "pv"."is_default" = true
		ORDER BY "pv"."created_at" ASC
		LIMIT 1
	),
	(
		SELECT "pv"."id"
		FROM "product_variants" AS "pv"
		WHERE "pv"."product_id" = "pm"."product_id"
		ORDER BY "pv"."created_at" ASC
		LIMIT 1
	)
)
WHERE "pm"."variant_id" IS NULL;--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "variant_id" SET NOT NULL;--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM "pg_constraint"
		WHERE "conname" = 'product_media_product_id_variant_id_media_asset_id_pk'
	) THEN
		ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_variant_id_media_asset_id_pk" PRIMARY KEY("product_id","variant_id","media_asset_id");
	END IF;
END $$;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "banner_image" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_media_product_variant_idx" ON "product_media" USING btree ("product_id","variant_id");
