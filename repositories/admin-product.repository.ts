/* eslint-disable @typescript-eslint/no-explicit-any */

import { and, count, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm'
import {
  categories,
  mediaAssets,
  productAttributes,
  productCategories,
  productFilters,
  productMedia,
  productVariants,
  products,
} from '@/db/schema/products'
import { db } from '@/lib/db'
import type {
  AdminProductPayload,
  AdminProductQuery,
} from '@/validators/admin-product.validator'

function buildProductWhere(query: AdminProductQuery, productIds?: string[]) {
  const filters = []

  if (query.search?.trim()) {
    const search = `%${query.search.trim()}%`
    filters.push(or(ilike(products.name, search), ilike(products.sku, search)))
  }

  if (productIds) {
    filters.push(productIds.length ? inArray(products.id, productIds) : sql`false`)
  }

  if (query.status?.trim()) {
    filters.push(
      eq(products.status, query.status.trim() as 'draft' | 'active' | 'archived'),
    )
  }

  return filters.length ? and(...filters) : undefined
}

function toPaise(value: unknown) {
  const numberValue = Number(value ?? 0)
  return Number.isFinite(numberValue) ? Math.round(numberValue * 100) : 0
}

function normalizeImage(item: any) {
  if (!item) return null
  if (typeof item === 'string') return item
  return item.key ?? item.mediaKey ?? item.preview ?? item.url ?? null
}

function getPrimaryVariant(payload: AdminProductPayload) {
  if (Array.isArray(payload.variants)) return payload

  return payload.variants ?? payload.variant ?? payload
}

async function getProductIdsByCategorySlug(slug?: string) {
  if (!slug?.trim()) return undefined

  const rows = await db
    .select({ productId: productCategories.productId })
    .from(productCategories)
    .innerJoin(categories, eq(productCategories.categoryId, categories.id))
    .where(eq(categories.slug, slug.trim()))

  return rows.map((row) => row.productId)
}

async function replaceProductCategories(
  tx: any,
  productId: string,
  categoryIds: string[],
) {
  await tx.delete(productCategories).where(eq(productCategories.productId, productId))

  if (categoryIds.length) {
    await tx.insert(productCategories).values(
      categoryIds.map((categoryId) => ({
        productId,
        categoryId,
      })),
    )
  }
}

async function replaceProductAttributes(tx: any, productId: string, attributes: any) {
  await tx.delete(productAttributes).where(eq(productAttributes.productId, productId))

  const entries: [string, any][] = Array.isArray(attributes)
    ? attributes.map((item: any) => [item.attribute ?? item.name, item.value])
    : Object.entries(attributes ?? {})

  const values = entries
    .map(([name, detail]: [string, any], index) => ({
      productId,
      name,
      value:
        typeof detail === 'object' && detail !== null
          ? String(detail.value ?? '')
          : String(detail ?? ''),
      sortOrder: index,
    }))
    .filter((item) => item.value)

  if (values.length) {
    await tx.insert(productAttributes).values(values)
  }
}

async function replaceProductFilters(tx: any, productId: string, filters: any[]) {
  await tx.delete(productFilters).where(eq(productFilters.productId, productId))

  const values = (filters ?? [])
    .map((item) => ({
      productId,
      name: String(item.type ?? item.name ?? '').trim(),
      value: String(item.filter ?? item.value ?? '').trim(),
    }))
    .filter((item) => item.name && item.value)

  if (values.length) {
    await tx.insert(productFilters).values(values)
  }
}

async function replaceProductVariants(tx: any, productId: string, variants: any[]) {
  await tx.delete(productVariants).where(eq(productVariants.productId, productId))

  const values = (variants ?? [])
    .map((variant, index) => ({
      productId,
      sku: String(variant.sku ?? '').trim(),
      title: String(variant.title ?? '').trim(),
      price: toPaise(variant.price),
      strikeThroughPrice: variant.strikeThroughPrice
        ? toPaise(variant.strikeThroughPrice)
        : null,
      stockQuantity: Number(variant.stockQuantity ?? 0),
      size: variant.size || null,
      color: variant.color || null,
      fabric: variant.fabric || null,
      isDefault: Boolean(variant.isDefault ?? index === 0),
      isActive: variant.isActive !== false,
      hasVariantBox: false,
    }))
    .filter((variant) => variant.sku && variant.title)

  if (values.length) {
    await tx.insert(productVariants).values(values)
  }
}

async function replaceProductMedia(
  tx: any,
  productId: string,
  payload: AdminProductPayload,
) {
  await tx.delete(productMedia).where(eq(productMedia.productId, productId))

  const variant = getPrimaryVariant(payload)
  const imageKeys = payload.media?.length
    ? payload.media.map((item: any) => item.key ?? item.mediaURL).filter(Boolean)
    : ([
        normalizeImage(variant.banner),
        ...(variant.gallery ?? []).map(normalizeImage),
      ].filter(Boolean) as string[])

  for (const [index, key] of imageKeys.entries()) {
    const [asset] = await tx
      .insert(mediaAssets)
      .values({
        key,
        contentType: 'image/*',
        ownerType: 'product',
      })
      .onConflictDoUpdate({
        target: mediaAssets.key,
        set: { key },
      })
      .returning({ id: mediaAssets.id })

    await tx.insert(productMedia).values({
      productId,
      mediaAssetId: asset.id,
      sortOrder: index,
      isPrimary: index === 0,
    })
  }
}

export async function findProductsPage(query: AdminProductQuery) {
  const page = Math.max(1, Number(query.page ?? 1))
  const pageSize = Math.max(1, Number(query.pageSize ?? 10))
  const categoryProductIds = await getProductIdsByCategorySlug(query.category)
  const where = buildProductWhere(query, categoryProductIds)

  const [totalResult] = await db
    .select({ value: count() })
    .from(products)
    .where(where)

  const rows = await db
    .select()
    .from(products)
    .where(where)
    .orderBy(desc(products.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  return {
    rows,
    page,
    pageSize,
    totalItems: totalResult?.value ?? 0,
  }
}

export async function findFullProduct(id: string) {
  const [product] = await db.select().from(products).where(eq(products.id, id))

  if (!product) return null

  const [
    categoryRes,
    productAttributeRes,
    productMediaRes,
    productVariantRes,
    filters,
  ] = await Promise.all([
    db
      .select({ categories })
      .from(productCategories)
      .innerJoin(categories, eq(productCategories.categoryId, categories.id))
      .where(eq(productCategories.productId, id)),
    db.select().from(productAttributes).where(eq(productAttributes.productId, id)),
    db
      .select({
        key: mediaAssets.key,
        mediaType: mediaAssets.contentType,
        sortOrder: productMedia.sortOrder,
        isPrimary: productMedia.isPrimary,
      })
      .from(productMedia)
      .innerJoin(mediaAssets, eq(productMedia.mediaAssetId, mediaAssets.id))
      .where(eq(productMedia.productId, id)),
    db.select().from(productVariants).where(eq(productVariants.productId, id)),
    db.select().from(productFilters).where(eq(productFilters.productId, id)),
  ])

  return {
    product,
    categoryRes,
    productAttributeRes,
    productMediaRes,
    productVariantRes,
    filters,
  }
}

export async function insertAdminProduct(
  payload: AdminProductPayload,
  categoryIds: string[],
  baseValues: {
    name: string
    sku: string
    slug: string
    shortDescription: string | null
    description: string | null
    basePrice: number
    strikeThroughPrice: number | null
    status: 'draft' | 'active' | 'archived'
    isFeatured: boolean
  },
) {
  return db.transaction(async (tx) => {
    const [created] = await tx.insert(products).values(baseValues).returning()
    const variant = getPrimaryVariant(payload)

    await replaceProductCategories(tx, created.id, categoryIds)
    await replaceProductAttributes(
      tx,
      created.id,
      payload.attributes ?? variant.attributes ?? {},
    )
    await replaceProductVariants(tx, created.id, payload.variants ?? [])
    await replaceProductFilters(tx, created.id, payload.filters ?? [])
    await replaceProductMedia(tx, created.id, payload)

    return created
  })
}

export async function updateAdminProduct(
  id: string,
  payload: AdminProductPayload,
  categoryIds: string[],
  baseValues: {
    name: string
    sku: string
    slug: string
    shortDescription: string | null
    description: string | null
    basePrice: number
    strikeThroughPrice: number | null
    status: 'draft' | 'active' | 'archived'
    isFeatured: boolean
    updatedAt: Date
  },
) {
  return db.transaction(async (tx) => {
    const [updated] = await tx
      .update(products)
      .set(baseValues)
      .where(eq(products.id, id))
      .returning()
    const variant = getPrimaryVariant(payload)

    await replaceProductCategories(tx, id, categoryIds)
    await replaceProductAttributes(tx, id, payload.attributes ?? variant.attributes ?? {})
    await replaceProductVariants(tx, id, payload.variants ?? [])
    await replaceProductFilters(tx, id, payload.filters ?? [])
    await replaceProductMedia(tx, id, payload)

    return updated
  })
}

export async function deleteAdminProduct(id: string) {
  return db.delete(products).where(eq(products.id, id))
}

export async function countAdminProducts() {
  const [result] = await db.select({ value: count() }).from(products)
  return result?.value ?? 0
}

export async function findProductFilterOptionRows() {
  return db
    .select({
      name: productFilters.name,
      value: productFilters.value,
    })
    .from(productFilters)
    .groupBy(productFilters.name, productFilters.value)
    .orderBy(productFilters.value)
}
