"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminProductService,
  deleteAdminProductService,
  getFullProductService,
  getProductFilterOptionsService,
  getProductsCountService,
  getProductsService,
  updateAdminProductService,
} from "@/services/admin-product.service";
import {
  validateAdminProductCreateInput,
  validateAdminProductQuery,
  validateAdminProductUpdateInput,
  type AdminProductPayload,
} from "@/validators/admin-product.validator";

export async function getProducts(query: unknown = {}) {
  return getProductsService(validateAdminProductQuery(query));
}

export async function getFullProduct(id: string) {
  return getFullProductService(id);
}

export async function createProduct(input: AdminProductPayload | FormData) {
  try {
    const created = await createAdminProductService(
      validateAdminProductCreateInput(input),
    );

    revalidatePath("/admin/products");
    return { success: true, message: "Product added successfully", data: created };
  } catch (error) {
    console.error("Create product failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to add product",
    };
  }
}

export async function updateProduct(
  idOrInput: string | FormData,
  payloadInput?: AdminProductPayload,
) {
  try {
    const updated = await updateAdminProductService(
      validateAdminProductUpdateInput(idOrInput, payloadInput),
    );

    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product updated successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Update product failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    await deleteAdminProductService(id);
    revalidatePath("/admin/products");

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Delete product failed:", error);
    return { success: false, message: "Failed to delete product" };
  }
}

export async function getProductsCount() {
  return getProductsCountService();
}

export async function getProductFilterOptions() {
  return getProductFilterOptionsService();
}
