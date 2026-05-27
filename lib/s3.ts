import { PutObjectCommand, S3Client, type S3ClientConfig } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const defaultUploadExpiresIn = 60

function getS3Region() {
  return process.env.S3_AWS_REGION ?? process.env.AWS_REGION ?? 'ap-south-1'
}

function getS3BucketName() {
  const bucketName = process.env.S3_BUCKET_NAME

  if (!bucketName) {
    throw new Error('Missing S3_BUCKET_NAME')
  }

  return bucketName
}

function getS3ClientConfig(): S3ClientConfig {
  const accessKeyId =
    process.env.S3_AWS_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey =
    process.env.S3_AWS_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY

  if (!accessKeyId || !secretAccessKey) {
    return {
      region: getS3Region(),
    }
  }

  return {
    region: getS3Region(),
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  }
}

export const s3Client = new S3Client(getS3ClientConfig())

export function getS3ObjectPreviewUrl(key: string) {
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL

  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, '')}/${key}`
  }

  return `https://${getS3BucketName()}.s3.${getS3Region()}.amazonaws.com/${key}`
}

export async function createS3ImageUploadUrl({
  key,
  contentType,
  expiresIn = defaultUploadExpiresIn,
}: {
  key: string
  contentType: string
  expiresIn?: number
}) {
  const command = new PutObjectCommand({
    Bucket: getS3BucketName(),
    Key: key,
    ContentType: contentType,
  })

  return getSignedUrl(s3Client, command, { expiresIn })
}
