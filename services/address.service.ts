import {
  deleteAddressRecord,
  findAddressRowById,
  hasOtherAddressRows,
  insertAddressRecord,
  listAddressRows,
  setDefaultAddressRecord,
  updateAddressRecord,
  type AddressRow,
} from '@/repositories/address.repository'
import { findUserByEmail } from '@/repositories/user.repository'
import type { AddressPayload } from '@/validators/address.validator'

export type AddressView = {
  id: string
  fullName: string
  phone: string
  line1: string
  line2: string
  locality: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  address: string
}

function mapAddressRow(row: AddressRow): AddressView {
  const addressParts = [
    row.line1,
    row.line2,
    row.locality,
    row.city,
    row.state,
    row.postalCode,
    row.country,
  ].filter(Boolean)

  return {
    id: row.id,
    fullName: row.fullName,
    phone: row.phone,
    line1: row.line1,
    line2: row.line2 ?? '',
    locality: row.locality ?? '',
    city: row.city,
    state: row.state,
    postalCode: row.postalCode,
    country: row.country,
    isDefault: row.isDefault,
    address: addressParts.join(', '),
  }
}

export async function getAddressUserId(sessionUser: { email?: string } | null) {
  if (!sessionUser?.email) {
    throw new Error('Unauthorized')
  }

  const user = await findUserByEmail(sessionUser.email)

  if (!user) {
    throw new Error('User profile not found')
  }

  return user.id
}

export async function getAddressesService(userId: string) {
  const rows = await listAddressRows(userId)

  return rows.map(mapAddressRow)
}

export async function getAddressByIdService(userId: string, id: string) {
  const row = await findAddressRowById(userId, id)

  return row ? mapAddressRow(row) : null
}

export async function createAddressService(
  userId: string,
  payload: AddressPayload,
) {
  const address = await insertAddressRecord(userId, payload)

  return mapAddressRow(address)
}

export async function updateAddressService(
  userId: string,
  id: string,
  payload: AddressPayload,
) {
  const address = await updateAddressRecord(userId, id, payload)

  return mapAddressRow(address)
}

export async function setDefaultAddressService(userId: string, id: string) {
  await setDefaultAddressRecord(userId, id)
}

export async function deleteAddressService(userId: string, id: string) {
  const hasOtherAddresses = await hasOtherAddressRows(userId, id)

  if (!hasOtherAddresses) {
    throw new Error('At least one address is required')
  }

  await deleteAddressRecord(userId, id)
}
