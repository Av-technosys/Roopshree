import { createHash, createHmac, timingSafeEqual } from "node:crypto"

export const ADMIN_ACCESS_COOKIE_NAME = "admin_access"

function getCookieSecret(): string {
  const secret = process.env.ADMIN_ACCESS_COOKIE_SECRET || "default_admin_access_cookie_secret_fallback_16_chars"
  if (secret.length < 16) {
    throw new Error("ADMIN_ACCESS_COOKIE_SECRET must be at least 16 characters long")
  }
  return secret
}

// Securely compares two strings of arbitrary length using SHA256 hashes to prevent timing attacks.
export function adminSecretsEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf8")
  const bBuf = Buffer.from(b, "utf8")
  const hashA = createHash("sha256").update(aBuf).digest()
  const hashB = createHash("sha256").update(bBuf).digest()
  return timingSafeEqual(hashA, hashB)
}

export function signAdminSession(): string {
  const secret = getCookieSecret()
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days expiration
  const payload = JSON.stringify({ v: 1, exp })
  const base64UrlPayload = Buffer.from(payload).toString("base64url")

  const signature = createHmac("sha256", secret)
    .update(base64UrlPayload)
    .digest()
  const base64UrlSignature = signature.toString("base64url")

  return `${base64UrlPayload}.${base64UrlSignature}`
}

export function verifyAdminSession(token?: string): boolean {
  if (!token) return false

  const parts = token.split(".")
  if (parts.length !== 2) return false

  const [base64UrlPayload, base64UrlSignature] = parts

  try {
    const secret = getCookieSecret()
    const expectedSignature = createHmac("sha256", secret)
      .update(base64UrlPayload)
      .digest()
    const providedSignature = Buffer.from(base64UrlSignature, "base64url")

    // Use timingSafeEqual to prevent signature timing analysis attacks
    if (
      expectedSignature.length !== providedSignature.length ||
      !timingSafeEqual(expectedSignature, providedSignature)
    ) {
      return false
    }

    const payloadJson = Buffer.from(base64UrlPayload, "base64url").toString("utf8")
    const payload = JSON.parse(payloadJson) as { v: number; exp: number }

    if (payload.v !== 1 || typeof payload.exp !== "number") {
      return false
    }

    // Check if expired
    return Date.now() < payload.exp
  } catch {
    return false
  }
}
