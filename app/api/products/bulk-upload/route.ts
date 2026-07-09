import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { createProduct } from "@/helper/product/action";
import { uploadImageFromUrlToS3 } from "@/lib/s3";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const csvText = await file.text();
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    }) as Record<string, string>[];

    // Group variants by product_sku
    const productsBySku = new Map<string, any[]>();
    for (const record of records) {
      const sku = record.product_sku;
      if (!sku) continue;
      if (!productsBySku.has(sku)) {
        productsBySku.set(sku, []);
      }
      productsBySku.get(sku)!.push(record);
    }

    const results = {
      total: productsBySku.size,
      successCount: 0,
      failedCount: 0,
      failedRows: [] as { sku: string; error: string }[],
    };

    for (const [sku, rows] of productsBySku.entries()) {
      try {
        const firstRow = rows[0];
        
        const payload = {
          name: firstRow.product_name,
          sku: firstRow.product_sku,
          price: String(Number(firstRow.product_price || 0)),
          strikeThroughPrice: firstRow.product_strike_through_price ? String(Number(firstRow.product_strike_through_price)) : "",
          shortDescription: firstRow.product_short_description || "",
          description: firstRow.product_description || "",
          status: "active" as const,
          isFeatured: firstRow.is_featured === "true" || firstRow.is_featured === "1",
          categoryIds: firstRow.category_ids 
            ? (firstRow.category_ids.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi) || []) 
            : [],
          attributes: [],
          filters: [],
          variants: [] as any[],
        };

        for (const [index, row] of rows.entries()) {
          const bannerKey = row.variant_banner_url ? await uploadImageFromUrlToS3(row.variant_banner_url) : "";
          
          let galleryKeys: { key: string }[] = [];
          if (row.variant_gallery_urls) {
            const urls = row.variant_gallery_urls.split(",").map((u: string) => u.trim()).filter(Boolean);
            const uploadedKeys = await Promise.all(urls.map((u: string) => uploadImageFromUrlToS3(u)));
            galleryKeys = uploadedKeys.filter(Boolean).map(key => ({ key: key as string }));
          }

          payload.variants.push({
            sku: row.variant_sku || `${sku}-V${index+1}`,
            title: row.variant_title || `Variant ${index+1}`,
            price: row.variant_price ? String(Number(row.variant_price)) : payload.price,
            strikeThroughPrice: row.variant_strike_through_price ? String(Number(row.variant_strike_through_price)) : payload.strikeThroughPrice,
            stockQuantity: row.variant_stock || "0",
            size: row.variant_size || "",
            color: row.variant_color || "",
            fabric: row.variant_fabric || "",
            isDefault: row.variant_is_default === "true" || row.variant_is_default === "1" || (index === 0 && !rows.some((r: any) => r.variant_is_default === "true" || r.variant_is_default === "1")),
            isActive: true,
            banner: bannerKey || "",
            gallery: galleryKeys,
          });
        }
        
        const result = await createProduct(payload as any);
        if (result.success) {
          results.successCount++;
        } else {
          results.failedCount++;
          results.failedRows.push({ sku, error: result.message || "Failed to create product" });
        }
      } catch (error) {
        results.failedCount++;
        results.failedRows.push({ sku, error: error instanceof Error ? error.message : "Unknown error" });
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Bulk upload error:", error);
    return NextResponse.json({ error: "Failed to process bulk upload" }, { status: 500 });
  }
}
