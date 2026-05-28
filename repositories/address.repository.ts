import { and, desc, eq, ne } from 'drizzle-orm'
import { addresses } from '@/db/schema/users'
import { db } from '@/lib/db'
import type { AddressPayload } from '@/validators/address.validator'

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export type AddressRow = typeof addresses.$inferSelect

function addressValues(userId: string, payload: AddressPayload) {
  return {
    userId,
    fullName: payload.fullName,
    phone: payload.phone,
    line1: payload.line1,
    line2: payload.line2 ?? null,
    locality: payload.locality ?? null,
    city: payload.city,
    state: payload.state,
    postalCode: payload.postalCode,
    country: payload.country,
    isDefault: payload.isDefault,
  }
}

async function unsetDefaultAddress(tx: DbTransaction, userId: string) {
  await tx
    .update(addresses)
    .set({ isDefault: false, updatedAt: new Date() })
    .where(eq(addresses.userId, userId))
}

async function setNewestAddressAsDefault(tx: DbTransaction, userId: string) {
  const [nextDefault] = await tx
    .select({ id: addresses.id })
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .orderBy(desc(addresses.createdAt))
    .limit(1)

  if (!nextDefault) return

  await tx
    .update(addresses)
    .set({ isDefault: true, updatedAt: new Date() })
      .where(eq(addresses.id, nextDefault.id))
}

async function normalizeDefaultAddress(
  tx: DbTransaction,
  userId: string,
  preferredAddressId?: string,
) {
  const rows = await tx
    .select({
      id: addresses.id,
      isDefault: addresses.isDefault,
    })
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt))

  if (rows.length === 0) return

  const defaultAddress =
    rows.find((row) => row.id === preferredAddressId) ??
    rows.find((row) => row.isDefault) ??
    rows[0]

  await tx
    .update(addresses)
    .set({ isDefault: false, updatedAt: new Date() })
    .where(and(eq(addresses.userId, userId), ne(addresses.id, defaultAddress.id)))

  await tx
    .update(addresses)
    .set({ isDefault: true, updatedAt: new Date() })
    .where(and(eq(addresses.userId, userId), eq(addresses.id, defaultAddress.id)))
}

export async function listAddressRows(userId: string): Promise<AddressRow[]> {
  return db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt))
}

export async function findAddressRowById(userId: string, id: string) {
  const [address] = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.userId, userId), eq(addresses.id, id)))
    .limit(1)

  return address ?? null
}

export async function insertAddressRecord(
  userId: string,
  payload: AddressPayload,
) {
  return db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: addresses.id })
      .from(addresses)
      .where(eq(addresses.userId, userId))
      .limit(1)

    const shouldBeDefault = payload.isDefault || existing.length === 0

    if (shouldBeDefault) {
      await unsetDefaultAddress(tx, userId)
    }

    const [created] = await tx
      .insert(addresses)
      .values({
        ...addressValues(userId, payload),
        isDefault: shouldBeDefault,
      })
      .returning()

    await normalizeDefaultAddress(
      tx,
      userId,
      shouldBeDefault ? created.id : undefined,
    )

    const [normalized] = await tx
      .select()
      .from(addresses)
      .where(eq(addresses.id, created.id))
      .limit(1)

    return normalized
  })
}

export async function updateAddressRecord(
  userId: string,
  id: string,
  payload: AddressPayload,
) {
  return db.transaction(async (tx) => {
    const [current] = await tx
      .select()
      .from(addresses)
      .where(and(eq(addresses.userId, userId), eq(addresses.id, id)))
      .limit(1)

    if (!current) {
      throw new Error('Address not found')
    }

    if (payload.isDefault) {
      await unsetDefaultAddress(tx, userId)
    }

    const [updated] = await tx
      .update(addresses)
      .set({
        ...addressValues(userId, payload),
        isDefault: payload.isDefault || current.isDefault,
        updatedAt: new Date(),
      })
      .where(and(eq(addresses.userId, userId), eq(addresses.id, id)))
      .returning()

    await normalizeDefaultAddress(
      tx,
      userId,
      payload.isDefault || current.isDefault ? id : undefined,
    )

    const [normalized] = await tx
      .select()
      .from(addresses)
      .where(eq(addresses.id, updated.id))
      .limit(1)

    return normalized
  })
}

export async function setDefaultAddressRecord(userId: string, id: string) {
  return db.transaction(async (tx) => {
    const [address] = await tx
      .select({ id: addresses.id })
      .from(addresses)
      .where(and(eq(addresses.userId, userId), eq(addresses.id, id)))
      .limit(1)

    if (!address) {
      throw new Error('Address not found')
    }

    await unsetDefaultAddress(tx, userId)

    await tx
      .update(addresses)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(and(eq(addresses.userId, userId), eq(addresses.id, id)))
  })
}

export async function deleteAddressRecord(userId: string, id: string) {
  return db.transaction(async (tx) => {
    const [address] = await tx
      .select({ id: addresses.id, isDefault: addresses.isDefault })
      .from(addresses)
      .where(and(eq(addresses.userId, userId), eq(addresses.id, id)))
      .limit(1)

    if (!address) {
      throw new Error('Address not found')
    }

    await tx
      .delete(addresses)
      .where(and(eq(addresses.userId, userId), eq(addresses.id, id)))

    if (address.isDefault) {
      await setNewestAddressAsDefault(tx, userId)
    }

    await normalizeDefaultAddress(tx, userId)
  })
}

export async function hasOtherAddressRows(userId: string, id: string) {
  const [address] = await db
    .select({ id: addresses.id })
    .from(addresses)
    .where(and(eq(addresses.userId, userId), ne(addresses.id, id)))
    .limit(1)

  return Boolean(address)
}
