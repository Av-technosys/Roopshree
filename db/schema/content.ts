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
    tags: varchar("tags").array(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    isVisible: boolean('is_visible').default(true).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('blogs_slug_idx').on(table.slug),
    index('blogs_category_id_idx').on(table.categoryId),
  ],
)



