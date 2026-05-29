'use server'

import { requireAdmin } from '@/lib/auth'
import { validateProductPayload } from '@/validators/product.validator'
import {
  createProduct,
  getCatalogCategories,
  getCatalogProductPage,
  getFeaturedProducts,
  getRecommendedProducts,
  searchCatalog,
  updateProduct,
} from '@/services/product.service'

export async function createProductAction(payload: unknown) {
  await requireAdmin()

  const data = validateProductPayload(payload)

  return createProduct(data)
}

export async function updateProductAction(productId: string, payload: unknown) {
  await requireAdmin()

  const data = validateProductPayload(payload)

  return updateProduct(productId, data)
}

export async function getCatalogProductPageAction(payload?: {
  limit?: number
  offset?: number
  categorySlug?: string
  featured?: boolean
  sortBy?: 'featured' | 'newest' | 'price-low' | 'price-high'
}) {
  return getCatalogProductPage(payload)
}

export async function getFeaturedProductsAction(limit?: number) {
  return getFeaturedProducts(limit)
}

export async function getRecommendedProductsAction(limit?: number) {
  return getRecommendedProducts(limit)
}

export async function getCatalogCategoriesAction(limit?: number) {
  return getCatalogCategories(limit)
}

export async function searchCatalogAction(term: string) {
  return searchCatalog(term)
}
