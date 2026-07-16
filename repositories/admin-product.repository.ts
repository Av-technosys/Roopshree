/* eslint-disable @typescript-eslint/no-explicit-any */

import { and, asc, count, desc, eq, ne, ilike, inArray, or, sql } from 'drizzle-orm'
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

function normalizeVariants(variants: any[]) {
  return (variants ?? [])
    .map((variant, index) => ({
      source: variant,
      value: {
        productId: '',
        sku: String(variant.sku ?? '').trim(),
        instagramLink: String(variant.instagramLink ?? '').trim() || null,
        title: String(variant.title ?? '').trim(),
        price: toPaise(variant.price),
        strikeThroughPrice: variant.strikeThroughPrice
          ? toPaise(variant.strikeThroughPrice)
          : null,
        stockQuantity: Number(variant.stockQuantity ?? 0),
        size: variant.size || null,
        color: variant.color || null,
        fabric: variant.fabric || null,
        bannerImage: normalizeImage(variant.banner),
        isDefault: Boolean(variant.isDefault ?? index === 0),
        isActive: variant.isActive !== false,
        hasVariantBox: false,
      },
    }))
    .filter((variant) => variant.value.sku && variant.value.title)
}

async function replaceProductVariants(tx: any, productId: string, variants: any[]) {
  await tx.delete(productVariants).where(eq(productVariants.productId, productId))

  const normalized = normalizeVariants(variants)

  if (!normalized.length) {
    throw new Error('At least one variant with a SKU and Title is required.')
  }

  const values = normalized.map((variant) => ({
    ...variant.value,
    productId,
  }))

  const inserted = await tx.insert(productVariants).values(values).returning()

  return inserted.map((variant: any, index: number) => ({
    ...variant,
    source: normalized[index]?.source ?? {},
  }))
}

async function replaceProductMedia(
  tx: any,
  productId: string,
  variants: { id: string; source: any }[],
) {
  await tx.delete(productMedia).where(eq(productMedia.productId, productId))

  // Collect all image entries across variants
  const allEntries: { variantId: string; key: string; index: number }[] = []
  for (const variant of variants) {
    const imageKeys = [
      normalizeImage(variant.source.banner),
      ...(variant.source.gallery ?? []).map(normalizeImage),
    ].filter(Boolean) as string[]

    imageKeys.forEach((key, index) => {
      allEntries.push({ variantId: variant.id, key, index })
    })
  }

  if (!allEntries.length) return

  // Batch upsert all mediaAssets in ONE query
  const insertedAssets = await tx
    .insert(mediaAssets)
    .values(
      allEntries.map(({ key }) => ({
        key,
        contentType: 'image/*',
        ownerType: 'product',
      })),
    )
    .onConflictDoUpdate({
      target: mediaAssets.key,
      set: { key: sql`excluded.key` },
    })
    .returning({ id: mediaAssets.id, key: mediaAssets.key })

  // Build a key → asset id map
  const keyToAssetId = new Map<string, string>(
    insertedAssets.map((a: { id: string; key: string }) => [a.key, a.id]),
  )

  // Batch insert all productMedia in ONE query
  await tx.insert(productMedia).values(
    allEntries.map(({ variantId, key, index }) => ({
      productId,
      variantId,
      mediaAssetId: keyToAssetId.get(key)!,
      sortOrder: index,
      isPrimary: index === 0,
    })),
  )
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
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      slug: products.slug,
      shortDescription: products.shortDescription,
      description: products.description,
      basePrice: products.basePrice,
      strikeThroughPrice: products.strikeThroughPrice,
      status: products.status,
      isFeatured: products.isFeatured,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      imageKey: mediaAssets.key,
      variantBannerImage: productVariants.bannerImage,
    })
    .from(products)
    .leftJoin(
      productVariants,
      and(
        eq(productVariants.productId, products.id),
        eq(productVariants.isDefault, true),
      ),
    )
    .leftJoin(
      productMedia,
      and(
        eq(productMedia.productId, products.id),
        eq(productMedia.variantId, productVariants.id),
        eq(productMedia.isPrimary, true),
      ),
    )
    .leftJoin(mediaAssets, eq(mediaAssets.id, productMedia.mediaAssetId))
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
        variantId: productMedia.variantId,
        sortOrder: productMedia.sortOrder,
        isPrimary: productMedia.isPrimary,
      })
      .from(productMedia)
      .innerJoin(mediaAssets, eq(productMedia.mediaAssetId, mediaAssets.id))
      .where(eq(productMedia.productId, id))
      .orderBy(asc(productMedia.variantId), desc(productMedia.isPrimary), asc(productMedia.sortOrder)),
    db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, id))
      .orderBy(desc(productVariants.isDefault), asc(productVariants.title)),
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
  let attempt = 1
  const originalSlug = baseValues.slug
  const originalSku = baseValues.sku

  let currentSlug = originalSlug
  let currentSku = originalSku

  while (true) {
    try {
      return await db.transaction(async (tx) => {
        // First check if slug already exists to prevent hitting constraint unnecessarily
        const [existingSlug] = await tx
          .select({ id: products.id })
          .from(products)
          .where(eq(products.slug, currentSlug))
          .limit(1)

        if (existingSlug) {
          throw new Error('SLUG_EXISTS')
        }

        // Check if SKU already exists
        const [existingSku] = await tx
          .select({ id: products.id })
          .from(products)
          .where(eq(products.sku, currentSku))
          .limit(1)

        if (existingSku) {
          throw new Error('SKU_EXISTS')
        }

        const [created] = await tx
          .insert(products)
          .values({ ...baseValues, slug: currentSlug, sku: currentSku })
          .returning()

        const variant = getPrimaryVariant(payload)

        await replaceProductCategories(tx, created.id, categoryIds)
        await replaceProductAttributes(
          tx,
          created.id,
          payload.attributes ?? variant.attributes ?? {},
        )
        const variants = await replaceProductVariants(tx, created.id, payload.variants ?? [])
        await replaceProductFilters(tx, created.id, payload.filters ?? [])
        await replaceProductMedia(tx, created.id, variants)

        return created
      })
    } catch (error: any) {
      const isSlugUniqueConstraintViolation =
        error?.code === '23505' &&
        (error?.detail?.includes('slug') ||
          error?.constraint === 'products_slug_idx' ||
          error?.message?.includes('products_slug_idx'))

      const isSkuUniqueConstraintViolation =
        error?.code === '23505' &&
        (error?.detail?.includes('sku') ||
          error?.constraint === 'products_sku_idx' ||
          error?.message?.includes('products_sku_idx'))

      const isSlugExistsError = error?.message === 'SLUG_EXISTS'
      const isSkuExistsError = error?.message === 'SKU_EXISTS'

      if (
        isSlugExistsError ||
        isSlugUniqueConstraintViolation ||
        isSkuExistsError ||
        isSkuUniqueConstraintViolation
      ) {
        attempt++
        currentSlug = `${originalSlug}-${attempt}`
        currentSku = `${originalSku}-${attempt}`
        continue
      }

      throw error
    }
  }
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
  let attempt = 1
  const originalSlug = baseValues.slug
  const originalSku = baseValues.sku

  let currentSlug = originalSlug
  let currentSku = originalSku

  while (true) {
    try {
      return await db.transaction(async (tx) => {
        // Check if slug is taken by any OTHER product
        const [existingSlug] = await tx
          .select({ id: products.id })
          .from(products)
          .where(and(eq(products.slug, currentSlug), ne(products.id, id)))
          .limit(1)

        if (existingSlug) {
          throw new Error('SLUG_EXISTS')
        }

        // Check if SKU is taken by any OTHER product
        const [existingSku] = await tx
          .select({ id: products.id })
          .from(products)
          .where(and(eq(products.sku, currentSku), ne(products.id, id)))
          .limit(1)

        if (existingSku) {
          throw new Error('SKU_EXISTS')
        }

        const [updated] = await tx
          .update(products)
          .set({ ...baseValues, slug: currentSlug, sku: currentSku })
          .where(eq(products.id, id))
          .returning()

        const variant = getPrimaryVariant(payload)

        await replaceProductCategories(tx, id, categoryIds)
        await replaceProductAttributes(tx, id, payload.attributes ?? variant.attributes ?? {})
        const variants = await replaceProductVariants(tx, id, payload.variants ?? [])
        await replaceProductFilters(tx, id, payload.filters ?? [])
        await replaceProductMedia(tx, id, variants)

        return updated
      })
    } catch (error: any) {
      const isSlugUniqueConstraintViolation =
        error?.code === '23505' &&
        (error?.detail?.includes('slug') ||
          error?.constraint === 'products_slug_idx' ||
          error?.message?.includes('products_slug_idx'))

      const isSkuUniqueConstraintViolation =
        error?.code === '23505' &&
        (error?.detail?.includes('sku') ||
          error?.constraint === 'products_sku_idx' ||
          error?.message?.includes('products_sku_idx'))

      const isSlugExistsError = error?.message === 'SLUG_EXISTS'
      const isSkuExistsError = error?.message === 'SKU_EXISTS'

      if (
        isSlugExistsError ||
        isSlugUniqueConstraintViolation ||
        isSkuExistsError ||
        isSkuUniqueConstraintViolation
      ) {
        attempt++
        currentSlug = `${originalSlug}-${attempt}`
        currentSku = `${originalSku}-${attempt}`
        continue
      }

      throw error
    }
  }
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
