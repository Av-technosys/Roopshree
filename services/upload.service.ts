import { randomUUID } from 'node:crypto'
import {
  createS3ImageUploadUrl,
  getS3ObjectPreviewUrl,
} from '@/lib/s3'
import type { ImageUploadPayload } from '@/validators/upload.validator'

const extensionByContentType: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

function createImageKey(payload: ImageUploadPayload) {
  const extension =
    extensionByContentType[payload.contentType] ??
    payload.fileName.split('.').pop()?.toLowerCase() ??
    'jpg'

  return `${payload.folder}/${new Date().getFullYear()}/${randomUUID()}.${extension}`
}

export async function createImageUpload(payload: ImageUploadPayload) {
  const key = createImageKey(payload)
  const uploadUrl = await createS3ImageUploadUrl({
    key,
    contentType: payload.contentType,
  })

  return {
    uploadUrl,
    key,
    previewUrl: getS3ObjectPreviewUrl(key),
  }
}
