import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { mediaAssets, products } from './products'
import { users } from './users'

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    title: varchar('title', { length: 180 }),
    message: text('message').notNull(),
    reviewerName: varchar('reviewer_name', { length: 160 }),
    reviewerEmail: varchar('reviewer_email', { length: 255 }),
    isApproved: boolean('is_approved').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('reviews_product_id_idx').on(table.productId),
    index('reviews_user_id_idx').on(table.userId),
    index('reviews_approved_idx').on(table.isApproved),
  ],
)

export const reviewMedia = pgTable(
  'review_media',
  {
    reviewId: uuid('review_id')
      .notNull()
      .references(() => reviews.id, { onDelete: 'cascade' }),
    mediaAssetId: uuid('media_asset_id')
      .notNull()
      .references(() => mediaAssets.id, { onDelete: 'cascade' }),
    sortOrder: integer('sort_order').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.reviewId, table.mediaAssetId] }),
    index('review_media_review_id_idx').on(table.reviewId),
  ],
)
