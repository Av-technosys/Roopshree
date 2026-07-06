import { PutObjectCommand, S3Client, type S3ClientConfig } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const defaultUploadExpiresIn = 60

function getS3Region() {
  return process.env.S3_AWS_REGION ?? process.env.AWS_REGION ?? 'ap-south-1'
}

function getS3BucketName() {
  const bucketName = process.env.AWS_BUCKET

  if (!bucketName) {
    throw new Error('Missing AWS_BUCKET')
  }

  return bucketName
}

function getS3ClientConfig(): S3ClientConfig {
  const accessKeyId =
    process.env.S3_ACCESS_KEY_ID ??
    process.env.ACCESS_KEY_ID ??
    process.env.ACCESS_KEY
  const secretAccessKey =
    process.env.S3_AWS_SECRET_ACCESS_KEY ??
    process.env.AWS_SECRET_ACCESS_KEY ??
    process.env.SECRET_KEY

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
  const publicBaseUrl =
    process.env.S3_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_S3_BASE_URL

  const s3Hostname = `https://${getS3BucketName()}.s3.${getS3Region()}.amazonaws.com/`

  if (key.startsWith('http://') || key.startsWith('https://')) {
    if (publicBaseUrl && key.startsWith(s3Hostname)) {
      return key.replace(s3Hostname, `${publicBaseUrl.replace(/\/$/, '')}/`)
    }
    return key;
  }


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

