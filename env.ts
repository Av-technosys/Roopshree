export const NEXT_PUBLIC_S3_BASE_URL =
  process.env.NEXT_PUBLIC_S3_BASE_URL ??
  process.env.S3_PUBLIC_BASE_URL ??
  "";
