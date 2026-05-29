import { and, count, desc, eq, ilike, or } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { db } from '@/lib/db'
import { categories, mediaAssets } from '@/db/schema/products'
import type { CategoryPayload, CategoryQuery } from '@/validators/category.validator'

function normalizeParentId(parentId?: string | null) {
  return parentId && parentId.trim() ? parentId : null
}

function buildCategoryWhere(query: CategoryQuery) {
  const filters = []

  if (query.search?.trim()) {
    const search = `%${query.search.trim()}%`
    filters.push(
      or(ilike(categories.name, search), ilike(categories.slug, search)),
    )
  }

  if (query.category?.trim()) {
    filters.push(eq(categories.slug, query.category.trim()))
  }

  return filters.length ? and(...filters) : undefined
}

async function getOrCreateCategoryMediaKey(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  key?: string | null,
) {
  const imageKey = key?.trim()

  if (!imageKey) return null

  await tx
    .insert(mediaAssets)
    .values({
      key: imageKey,
      contentType: 'image/*',
      ownerType: 'category',
    })
    .onConflictDoUpdate({
      target: mediaAssets.key,
      set: { key: imageKey },
    })

  return imageKey
}

export async function findCategories() {
  return db.select().from(categories).orderBy(categories.name)
}

export async function findCategoryMeta() {
  return db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .orderBy(categories.name)
}

export async function findCategoriesPage(query: CategoryQuery) {
  const page = Math.max(1, Number(query.page ?? 1))
  const pageSize = Math.max(1, Number(query.pageSize ?? 10))
  const where = buildCategoryWhere(query)
  const parentCategories = alias(categories, 'parent_categories')

  const [totalResult] = await db
    .select({ value: count() })
    .from(categories)
    .where(where)

  const items = await db
    .select({
      id: categories.id,
      parentId: categories.parentId,
      parentName: parentCategories.name,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      bannerImage: categories.bannerImage,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
    })
    .from(categories)
    .leftJoin(parentCategories, eq(categories.parentId, parentCategories.id))
    .where(where)
    .orderBy(desc(categories.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  const totalItems = totalResult?.value ?? 0

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
  }
}

export async function insertCategoryRecord(
  payload: CategoryPayload & { slug: string },
) {
  return db.transaction(async (tx) => {
    const bannerImage = await getOrCreateCategoryMediaKey(tx, payload.bannerImage)

    await tx.insert(categories).values({
      name: payload.name,
      slug: payload.slug,
      parentId: normalizeParentId(payload.parentId),
      description: payload.description || null,
      bannerImage,
    })
  })
}

export async function updateCategoryRecord(
  payload: CategoryPayload & { id: string; slug: string },
) {
  return db.transaction(async (tx) => {
    const bannerImage = await getOrCreateCategoryMediaKey(tx, payload.bannerImage)

    const [updatedCategory] = await tx
      .update(categories)
      .set({
        name: payload.name,
        slug: payload.slug,
        parentId: normalizeParentId(payload.parentId),
        description: payload.description || null,
        bannerImage,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, payload.id))
      .returning({ id: categories.id })

    if (!updatedCategory) {
      throw new Error('Category not found')
    }
  })
}

export async function deleteCategoryRecord(id: string) {
  return db.delete(categories).where(eq(categories.id, id))
}
