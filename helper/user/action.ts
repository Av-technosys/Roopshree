"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, requireUser } from "@/lib/auth";
import {
  getProfileService,
  updateProfileService,
} from "@/services/user.service";
import { validateProfilePayload } from "@/validators/profile.validator";

export async function requireUserWithRefresh() {
  return requireUser();
}

export async function getProfile() {
  const sessionUser = await getCurrentUser();

  return getProfileService(sessionUser);
}

export async function updateProfile(payload: unknown) {
  try {
    const sessionUser = await requireUser();
    await updateProfileService(sessionUser, validateProfilePayload(payload));

    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/profile");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Update profile failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
