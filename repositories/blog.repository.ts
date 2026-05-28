import { desc, eq } from 'drizzle-orm'
import { blogCategories, blogs } from '@/db/schema/content'
import { mediaAssets } from '@/db/schema/products'
import { db } from '@/lib/db'
import type { BlogPayload } from '@/validators/blog.validator'

type BlogWritePayload = BlogPayload & {
  slug: string
  tags: string[]
}

async function getOrCreateBlogCategory(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  name?: string,
) {
  const categoryName = name?.trim()

  if (!categoryName) return null

  const slug = categoryName
    .trim()
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

async function getOrCreateCoverMediaId(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  image?: string,
) {
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
