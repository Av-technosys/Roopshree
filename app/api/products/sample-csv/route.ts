import { NextResponse } from "next/server";

export async function GET() {
  const headers = new Headers({
    "Content-Type": "text/csv",
    "Content-Disposition": 'attachment; filename="sample_products.csv"',
  });

  const csvContent = `product_name,product_sku,product_price,product_strike_through_price,product_short_description,product_description,category_ids,is_featured,variant_sku,variant_title,variant_price,variant_strike_through_price,variant_stock,variant_color,variant_size,variant_fabric,variant_is_default,variant_banner_url,variant_gallery_urls
"Sample Dress","DRESS-001","1999","2499","Beautiful dress","Long description here","","true","DRESS-001-RED","Red - M","1999","2499","10","Red","M","Cotton","true","https://example.com/banner.jpg","https://example.com/gal1.jpg,https://example.com/gal2.jpg"
"Sample Dress","DRESS-001","1999","2499","Beautiful dress","Long description here","","true","DRESS-001-BLUE","Blue - M","1999","2499","5","Blue","M","Cotton","false","",""`;

  return new NextResponse(csvContent, { headers });
}
