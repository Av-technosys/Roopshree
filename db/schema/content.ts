import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { mediaAssets } from './products'

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}

export const blogCategories = pgTable(
  'blog_categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 160 }).notNull(),
    slug: varchar('slug', { length: 180 }).notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex('blog_categories_slug_idx').on(table.slug)],
)

export const blogs = pgTable(
  'blogs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    categoryId: uuid('category_id').references(() => blogCategories.id, {
      onDelete: 'set null',
    }),
    authorName: varchar('author_name', { length: 160 }),
    title: varchar('title', { length: 220 }).notNull(),
    slug: varchar('slug', { length: 180 }).notNull(),
    metaDescription: varchar('meta_description', { length: 300 }),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    coverMediaId: uuid('cover_media_id').references(() => mediaAssets.id, {
      onDelete: 'set null',
    }),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    isVisible: boolean('is_visible').default(true).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('blogs_slug_idx').on(table.slug),
    index('blogs_category_id_idx').on(table.categoryId),
  ],
)

export const blogTags = pgTable(
  'blog_tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 120 }).notNull(),
    slug: varchar('slug', { length: 140 }).notNull(),
  },
  (table) => [uniqueIndex('blog_tags_slug_idx').on(table.slug)],
)

export const blogTagMap = pgTable(
  'blog_tag_map',
  {
    blogId: uuid('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => blogTags.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.blogId, table.tagId] })],
)

export const videos = pgTable(
  'videos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    url: text('url').notNull(),
    description: text('description'),
    category: varchar('category', { length: 120 }),
    thumbnailMediaId: uuid('thumbnail_media_id').references(() => mediaAssets.id, {
      onDelete: 'set null',
    }),
    isVisible: boolean('is_visible').default(true).notNull(),
    ...timestamps,
  },
  (table) => [index('videos_category_idx').on(table.category)],
)

export const catalogues = pgTable(
  'catalogues',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 180 }).notNull(),
    slug: varchar('slug', { length: 180 }).notNull(),
    shortDescription: text('short_description').notNull(),
    imageMediaId: uuid('image_media_id').references(() => mediaAssets.id, {
      onDelete: 'set null',
    }),
    pdfMediaId: uuid('pdf_media_id').references(() => mediaAssets.id, {
      onDelete: 'set null',
    }),
    totalPages: integer('total_pages'),
    publishYear: integer('publish_year'),
    category: varchar('category', { length: 120 }),
    isFeatured: boolean('is_featured').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('catalogues_slug_idx').on(table.slug),
    index('catalogues_category_idx').on(table.category),
  ],
)

