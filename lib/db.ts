import { drizzle } from 'drizzle-orm/postgres-js'
import postgres, { type Sql } from 'postgres'
import { DATABASE_URL } from '@/config/env'
import * as schema from '@/db'

type GlobalWithPostgres = typeof globalThis & {
  postgresClient?: Sql
}

const globalForDb = globalThis as GlobalWithPostgres

export const sql =
  globalForDb.postgresClient ??
  postgres(DATABASE_URL, {
    max: 10,
    prepare: false,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.postgresClient = sql
}

export const db = drizzle(sql, { schema })
