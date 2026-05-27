'use server'

import { requireAdmin } from '@/lib/auth'
import { createImageUpload } from '@/services/upload.service'
import { validateImageUploadPayload } from '@/validators/upload.validator'

export async function createImageUploadAction(payload: unknown) {
  await requireAdmin()

  const data = validateImageUploadPayload(payload)

  return createImageUpload(data)
}
