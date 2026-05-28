'use server'

import { createImageUpload } from '@/services/upload.service'
import { validateImageUploadPayload } from '@/validators/upload.validator'

export async function createImageUploadAction(payload: unknown) {
  try {
    const data = validateImageUploadPayload(payload)

    return createImageUpload(data)
  } catch (error) {
    console.error('Create image upload failed:', error)
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create image upload',
    }
  }
}
