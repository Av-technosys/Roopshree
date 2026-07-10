"use server";

import { db } from "@/lib/db";
import { count, sum } from "drizzle-orm";
import { orders } from "@/db/schema/orders";
import { users } from "@/db/schema/users";
import { products } from "@/db/schema/products";

export async function getDashboardStats() {
  const [
    productsResult,
    ordersResult,
    usersResult,
    revenueResult,
  ] = await Promise.all([
    db.select({ value: count() }).from(products),
    db.select({ value: count() }).from(orders),
    db.select({ value: count() }).from(users),
    db.select({ value: sum(orders.totalAmount) }).from(orders),
  ]);

  const totalProducts = productsResult[0]?.value ?? 0;
  const totalOrders = ordersResult[0]?.value ?? 0;
  const totalUsers = usersResult[0]?.value ?? 0;
  // totalAmount is in paise (cents), so we divide by 100 to get the correct currency unit
  const totalRevenueInPaise = Number(revenueResult[0]?.value ?? 0);
  const totalRevenue = totalRevenueInPaise / 100;

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue,
  };
}
