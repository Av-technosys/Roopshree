export type CouponPayload = {
  code: string
  discountType: 'flat' | 'percent'
  discountValue: number
  expiresAt?: Date
}

export function validateCouponPayload(payload: unknown): CouponPayload {
  const data = payload as Partial<CouponPayload>

  if (!data.code || !data.discountType || typeof data.discountValue !== 'number') {
    throw new Error('Invalid coupon payload')
  }

  return {
    code: data.code.trim().toUpperCase(),
    discountType: data.discountType,
    discountValue: data.discountValue,
    expiresAt: data.expiresAt,
  }
}
