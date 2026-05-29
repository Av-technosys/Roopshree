import { eq } from "drizzle-orm"

import { users } from "@/db/schema/users"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export async function getCurrentDbUserId() {
  const sessionUser = await getCurrentUser()

  if (!sessionUser?.sub) return null

  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.cognitoSub, sessionUser.sub))
    .limit(1)

  return existingUser?.id ?? null
}
