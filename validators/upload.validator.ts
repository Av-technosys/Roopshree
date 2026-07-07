const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
const allowedUploadTypes = [...allowedImageTypes, ...allowedVideoTypes]
const maxImageSize = 15 * 1024 * 1024
const maxVideoSize = 25 * 1024 * 1024

export type ImageUploadPayload = {
  fileName: string
  contentType: string
  size: number
  folder?: 'products' | 'categories' | 'banners' | 'users' | 'reviews'
}

export function validateImageUploadPayload(payload: unknown): ImageUploadPayload {
  const data = payload as Partial<ImageUploadPayload>

  if (!data.fileName || !data.contentType || typeof data.size !== 'number') {
    throw new Error('Invalid upload payload')
  }

  if (!allowedUploadTypes.includes(data.contentType)) {
    throw new Error('Unsupported media type')
  }

  const maxSize = allowedVideoTypes.includes(data.contentType)
    ? maxVideoSize
    : maxImageSize

  if (data.size > maxSize) {
    throw new Error(
      allowedVideoTypes.includes(data.contentType)
        ? 'Video size must be 25MB or less'
        : 'Image size must be 15MB or less',
    )
  }

  return {
    fileName: data.fileName,
    contentType: data.contentType,
    size: data.size,
    folder: data.folder ?? 'products',
  }
}
