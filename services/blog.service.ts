import {
  deleteBlogRecord,
  findBlogByIdWithRelations,
  findBlogRowBySlug,
  findBlogsWithRelations,
  insertBlogRecord,
  listBlogCategoryRows,
  listBlogRows,
  updateBlogRecord,
  type BlogListQuery,
  type BlogRow,
} from '@/repositories/blog.repository'
import { getS3ObjectPreviewUrl } from '@/lib/s3'
import type { BlogPayload } from '@/validators/blog.validator'

export type BlogView = {
  id: string
  slug: string
  title: string
  excerpt: string
  image: string
  author: string
  authorRole: string
  date: string
  readTime: string
  category: string
  categorySlug: string
  tags: string[]
  content: string[]
}

export type BlogCategoryView = {
  id: string
  name: string
  slug: string
}

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

function formatBlogDate(date: Date | null) {
  if (!date) return ''

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function splitBlogContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function getReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 180))

  return `${minutes} min read`
}

function mapBlogListRow(row: BlogRow): BlogView {
  const displayDate = row.publishedAt ?? row.createdAt

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? row.metaDescription ?? '',
    image: row.imageKey ? getS3ObjectPreviewUrl(row.imageKey) : '',
    author: row.authorName ?? 'Roop Shree',
    authorRole: 'Textile Journal',
    date: formatBlogDate(displayDate),
    readTime: getReadTime(row.content),
    category: row.categoryName ?? 'Journal',
    categorySlug: row.categorySlug ?? '',
    tags: row.tags ?? [],
    content: splitBlogContent(row.content),
  }
}

function mapBlogAdminRow({
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

  return rows.map(mapBlogAdminRow)
}

export async function getBlogByIdService(id: string) {
  const row = await findBlogByIdWithRelations(id)

  return row ? mapBlogAdminRow(row) : null
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

export async function getBlogCategories() {
  const categories = await listBlogCategoryRows()

  return categories.map((category): BlogCategoryView => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
  }))
}

export async function getBlogs(query: BlogListQuery = {}) {
  const rows = await listBlogRows(query)

  return rows.map(mapBlogListRow)
}

export async function getBlogBySlug(slug: string) {
  const row = await findBlogRowBySlug(slug)

  return row ? mapBlogListRow(row) : null
}

export async function getBlogDetailPageData(slug: string) {
  const post = await getBlogBySlug(slug)

  if (!post) return null

  const [relatedPosts, morePosts] = await Promise.all([
    getBlogs({
      categorySlug: post.categorySlug || undefined,
      excludeSlug: post.slug,
      limit: 3,
    }),
    getBlogs({
      excludeSlug: post.slug,
      limit: 4,
    }),
  ])

  return {
    post,
    relatedPosts,
    morePosts,
  }
}