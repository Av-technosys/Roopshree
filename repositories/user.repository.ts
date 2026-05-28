import { db } from '@/lib/db'
import { users } from '@/db/schema/users'
import { eq } from 'drizzle-orm'

type UserRecord = {
  id: string
  email: string
  role: 'user' | 'admin'
}

export async function listUsers(): Promise<UserRecord[]> {
  void db

  // Replace with a Drizzle select from users.
  return [] satisfies UserRecord[]
}

export async function getUserById(userId: string): Promise<UserRecord | null> {
  void db
  void userId

  // Replace with a Drizzle select by id.
  return null satisfies UserRecord | null
}

export async function findUserByEmail(email: string) {
  const [profile] = await db.select().from(users).where(eq(users.email, email))

  return profile ?? null
}
