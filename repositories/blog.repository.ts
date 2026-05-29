import {
  and,
  desc,
  eq,
  ilike,
  isNull,
  lte,
  ne,
  or,
  type SQL,
} from 'drizzle-orm'
import { blogCategories, blogs } from '@/db/schema/content'
import { mediaAssets } from '@/db/schema/products'
import { db } from '@/lib/db'
import type { BlogPayload } from '@/validators/blog.validator'

type BlogWritePayload = BlogPayload & {
  slug: string
  tags: string[]
}

export type BlogListQuery = {
  limit?: number
  offset?: number
  categorySlug?: string
  search?: string
  excludeSlug?: string
}

export type BlogRow = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  authorName: string | null
  metaDescription: string | null
  tags: string[] | null
  publishedAt: Date | null
  createdAt: Date
  categoryName: string | null
  categorySlug: string | null
  imageKey: string | null
  imageAlt: string | null
}

export type BlogCategoryRow = {
  id: string
  name: string
  slug: string
}

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

async function getOrCreateBlogCategory(tx: DbTransaction, name?: string) {
  const categoryName = name?.trim()

  if (!categoryName) return null

  const slug = categoryName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const [existing] = await tx
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.slug, slug))

  if (existing) return existing

  const [created] = await tx
    .insert(blogCategories)
    .values({ name: categoryName, slug })
    .returning()

  return created
}

async function getOrCreateCoverMediaId(tx: DbTransaction, image?: string) {
  const key = image?.trim()

  if (!key) return null

  const [asset] = await tx
    .insert(mediaAssets)
    .values({
      key,
      contentType: 'image/*',
      ownerType: 'blog',
    })
    .onConflictDoUpdate({
      target: mediaAssets.key,
      set: { key },
    })
    .returning({ id: mediaAssets.id })

  return asset.id
}

function getPublishedBlogWhere(query: BlogListQuery = {}) {
  const filters: (SQL | undefined)[] = [
    eq(blogs.isVisible, true),
    or(isNull(blogs.publishedAt), lte(blogs.publishedAt, new Date())),
    query.categorySlug ? eq(blogCategories.slug, query.categorySlug) : undefined,
    query.search ? ilike(blogs.title, `%${query.search}%`) : undefined,
    query.excludeSlug ? ne(blogs.slug, query.excludeSlug) : undefined,
  ]

  return and(...filters)
}

function getBlogSelect() {
  return {
    id: blogs.id,
    slug: blogs.slug,
    title: blogs.title,
    excerpt: blogs.excerpt,
    content: blogs.content,
    authorName: blogs.authorName,
    metaDescription: blogs.metaDescription,
    tags: blogs.tags,
    publishedAt: blogs.publishedAt,
    createdAt: blogs.createdAt,
    categoryName: blogCategories.name,
    categorySlug: blogCategories.slug,
    imageKey: mediaAssets.key,
    imageAlt: mediaAssets.altText,
  }
}

export async function findBlogsWithRelations() {
  return db
    .select({
      blog: blogs,
      category: blogCategories,
      cover: mediaAssets,
    })
    .from(blogs)
    .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
    .leftJoin(mediaAssets, eq(blogs.coverMediaId, mediaAssets.id))
    .orderBy(desc(blogs.createdAt))
}

export async function findBlogByIdWithRelations(id: string) {
  const [row] = await db
    .select({
      blog: blogs,
      category: blogCategories,
      cover: mediaAssets,
    })
    .from(blogs)
    .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
    .leftJoin(mediaAssets, eq(blogs.coverMediaId, mediaAssets.id))
    .where(eq(blogs.id, id))

  return row ?? null
}

export async function insertBlogRecord(payload: BlogWritePayload) {
  return db.transaction(async (tx) => {
    const category = await getOrCreateBlogCategory(tx, payload.blogCategory)
    const coverMediaId = await getOrCreateCoverMediaId(
      tx,
      payload.imageKey ?? payload.image,
    )

    await tx.insert(blogs).values({
      title: payload.title,
      slug: payload.slug,
      metaDescription: payload.metaDescription || null,
      categoryId: category?.id ?? null,
      authorName: payload.userName || null,
      content: payload.data ?? payload.content ?? '',
      coverMediaId,
      tags: payload.tags,
      publishedAt: payload.date ? new Date(payload.date) : new Date(),
      isVisible: true,
    })
  })
}

export async function updateBlogRecord(id: string, payload: BlogWritePayload) {
  return db.transaction(async (tx) => {
    const category = await getOrCreateBlogCategory(tx, payload.blogCategory)
    const coverMediaId = await getOrCreateCoverMediaId(
      tx,
      payload.imageKey ?? payload.image,
    )

    await tx
      .update(blogs)
      .set({
        title: payload.title,
        slug: payload.slug,
        metaDescription: payload.metaDescription || null,
        categoryId: category?.id ?? null,
        authorName: payload.userName || null,
        content: payload.data ?? payload.content ?? '',
        coverMediaId,
        tags: payload.tags,
        publishedAt: payload.date ? new Date(payload.date) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, id))
  })
}

export async function deleteBlogRecord(id: string) {
  return db.delete(blogs).where(eq(blogs.id, id))
}

export async function listBlogRows(
  query: BlogListQuery = {},
): Promise<BlogRow[]> {
  return db
    .select(getBlogSelect())
    .from(blogs)
    .leftJoin(blogCategories, eq(blogCategories.id, blogs.categoryId))
    .leftJoin(mediaAssets, eq(mediaAssets.id, blogs.coverMediaId))
    .where(getPublishedBlogWhere(query))
    .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt))
    .limit(query.limit ?? 24)
    .offset(query.offset ?? 0)
}

export async function findBlogRowBySlug(slug: string): Promise<BlogRow | null> {
  const [blog] = await db
    .select(getBlogSelect())
    .from(blogs)
    .leftJoin(blogCategories, eq(blogCategories.id, blogs.categoryId))
    .leftJoin(mediaAssets, eq(mediaAssets.id, blogs.coverMediaId))
    .where(and(getPublishedBlogWhere(), eq(blogs.slug, slug)))
    .limit(1)

  return blog ?? null
}

export async function listBlogCategoryRows(): Promise<BlogCategoryRow[]> {
  return db
    .select({
      id: blogCategories.id,
      name: blogCategories.name,
      slug: blogCategories.slug,
    })
    .from(blogCategories)
    .orderBy(blogCategories.name)
}