"use server";

import { getCurrentUser, requireUser } from "@/lib/auth";
import { getProfileService } from "@/services/user.service";

export async function requireUserWithRefresh() {
  return requireUser();
}

export async function getProfile() {
  const sessionUser = await getCurrentUser();

  return getProfileService(sessionUser);
}
