const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxImageSize = 5 * 1024 * 1024

export type ImageUploadPayload = {
  fileName: string
  contentType: string
  size: number
  folder?: 'products' | 'categories' | 'banners' | 'users'
}

export function validateImageUploadPayload(payload: unknown): ImageUploadPayload {
  const data = payload as Partial<ImageUploadPayload>

  if (!data.fileName || !data.contentType || typeof data.size !== 'number') {
    throw new Error('Invalid upload payload')
  }

  if (!allowedImageTypes.includes(data.contentType)) {
    throw new Error('Unsupported image type')
  }

  if (data.size > maxImageSize) {
    throw new Error('Image size must be 5MB or less')
  }

  return {
    fileName: data.fileName,
    contentType: data.contentType,
    size: data.size,
    folder: data.folder ?? 'products',
  }
}
