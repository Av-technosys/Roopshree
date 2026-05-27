import { db } from '@/lib/db'

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
