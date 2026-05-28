"use client";

import ProductForm from "../ProductForm";

export default function EditProduct({ productDetails }: { productDetails: Parameters<typeof ProductForm>[0]["product"] }) {
  return (
    <div className="p-4">
      <ProductForm product={productDetails} />
    </div>
  );
}
