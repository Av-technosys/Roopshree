'use server'

import { requireAdmin } from '@/lib/auth'
import { getUserById, listUsers } from '@/repositories/user.repository'

export async function listUsersAction() {
  await requireAdmin()

  return listUsers()
}

export async function getUserAction(userId: string) {
  await requireAdmin()

  return getUserById(userId)
}
