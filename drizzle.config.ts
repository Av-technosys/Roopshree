import { defineConfig } from 'drizzle-kit'
import { DATABASE_URL } from '@/config/env'

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
})
