"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import {
  createAddressService,
  deleteAddressService,
  getAddressByIdService,
  getAddressesService,
  getAddressUserId,
  setDefaultAddressService,
  updateAddressService,
} from "@/services/address.service";
import { validateAddressPayload } from "@/validators/address.validator";

const addressBookPath = "/dashboard/address-book";

async function getCurrentAddressUserId() {
  return getAddressUserId(await requireUser());
}

export async function getAddresses() {
  const userId = await getCurrentAddressUserId();

  return getAddressesService(userId);
}

export async function getAddressById(id: string) {
  const userId = await getCurrentAddressUserId();

  return getAddressByIdService(userId, id);
}

export async function createAddress(payload: unknown) {
  try {
    const userId = await getCurrentAddressUserId();
    await createAddressService(userId, validateAddressPayload(payload));

    revalidatePath(addressBookPath);
    return { success: true, message: "Address created successfully" };
  } catch (error) {
    console.error("Create address failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create address",
    };
  }
}

export async function updateAddress(id: string, payload: unknown) {
  try {
    const userId = await getCurrentAddressUserId();
    await updateAddressService(userId, id, validateAddressPayload(payload));

    revalidatePath(addressBookPath);
    revalidatePath(`${addressBookPath}/edit`);
    return { success: true, message: "Address updated successfully" };
  } catch (error) {
    console.error("Update address failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update address",
    };
  }
}

export async function setDefaultAddress(id: string) {
  try {
    const userId = await getCurrentAddressUserId();
    await setDefaultAddressService(userId, id);

    revalidatePath(addressBookPath);
    return { success: true, message: "Default address updated successfully" };
  } catch (error) {
    console.error("Set default address failed:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update default address",
    };
  }
}

export async function deleteAddress(id: string) {
  try {
    const userId = await getCurrentAddressUserId();
    await deleteAddressService(userId, id);

    revalidatePath(addressBookPath);
    return { success: true, message: "Address deleted successfully" };
  } catch (error) {
    console.error("Delete address failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete address",
    };
  }
}
