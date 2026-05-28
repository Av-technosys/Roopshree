import {
  deleteBlogRecord,
  findBlogByIdWithRelations,
  findBlogsWithRelations,
  insertBlogRecord,
  updateBlogRecord,
} from '@/repositories/blog.repository'
import { getS3ObjectPreviewUrl } from '@/lib/s3'
import type { BlogPayload } from '@/validators/blog.validator'

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeTags(tags?: string[] | string) {
  if (Array.isArray(tags)) return tags.filter(Boolean)
  if (!tags) return []

  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function mapBlogRow({
  blog,
  category,
  cover,
}: Awaited<ReturnType<typeof findBlogsWithRelations>>[number]) {
  const image = cover?.key ? getS3ObjectPreviewUrl(cover.key) : ''

  return {
    ...blog,
    blogCategory: category?.name ?? '',
    date: blog.publishedAt
      ? blog.publishedAt.toISOString().split('T')[0]
      : blog.createdAt.toISOString().split('T')[0],
    data: blog.content,
    userName: blog.authorName ?? '',
    image,
    imageKey: cover?.key ?? '',
    imagePreview: image,
  }
}

export async function getBlogsService() {
  const rows = await findBlogsWithRelations()

  return rows.map(mapBlogRow)
}

export async function getBlogByIdService(id: string) {
  const row = await findBlogByIdWithRelations(id)

  return row ? mapBlogRow(row) : null
}

export async function createBlogService(payload: BlogPayload) {
  await insertBlogRecord({
    ...payload,
    slug: slugify(payload.title),
    tags: normalizeTags(payload.tags),
  })
}

export async function updateBlogService(id: string, payload: BlogPayload) {
  await updateBlogRecord(id, {
    ...payload,
    slug: slugify(payload.title),
    tags: normalizeTags(payload.tags),
  })
}

export async function deleteBlogService(id: string) {
  await deleteBlogRecord(id)
}
