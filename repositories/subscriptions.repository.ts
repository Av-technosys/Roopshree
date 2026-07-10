import { db } from "@/lib/db";
import { subscriptions } from "@/db/schema/users";
import { desc } from "drizzle-orm";

export async function fetchSubscriptions() {
  return db
    .select()
    .from(subscriptions)
    .orderBy(desc(subscriptions.createdAt));
}
