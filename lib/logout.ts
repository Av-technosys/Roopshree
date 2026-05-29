'use client'

import { signOutAction } from '@/actions/auth.action'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

export async function logout() {
  await signOutAction()
  useCartStore.getState().clearCart()
  useWishlistStore.getState().clearWishlist()
}
