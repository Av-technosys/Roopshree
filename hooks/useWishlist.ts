"use client"

import { useRouter } from "next/navigation"

import {
  removeUserWishlistItem,
  toggleUserWishlistItem,
} from "@/actions/wishlist.action"
import { useWishlistStore } from "@/store/wishlistStore"
import type { CartItemInput } from "@/store/cartTypes"

export function useWishlist() {
  const router = useRouter()
  const toggleItemOptimistic = useWishlistStore((state) => state.toggleItem)
  const addItem = useWishlistStore((state) => state.addItem)
  const removeItem = useWishlistStore((state) => state.removeItem)
  const hasItem = useWishlistStore((state) => state.hasItem)

  function redirectToAuth() {
    router.push("/auth")
  }

  async function handleToggleWishlist(product: CartItemInput) {
    toggleItemOptimistic(product)

    if (!product.dbProductId) return

    try {
      const result = await toggleUserWishlistItem(product.dbProductId)

      if (!result.success) {
        toggleItemOptimistic(product)
      }

      if (result.userIsNotLoggedIn) {
        toggleItemOptimistic(product)
        redirectToAuth()
      }
    } catch (error) {
      console.error(error)
      toggleItemOptimistic(product)
    }
  }

  async function handleRemoveWishlist(product: CartItemInput) {
    removeItem(product.productId)

    if (!product.dbProductId) return

    try {
      const result = await removeUserWishlistItem(product.dbProductId)

      if (!result.success) {
        addItem(product)
      }

      if (result.userIsNotLoggedIn) {
        addItem(product)
        redirectToAuth()
      }
    } catch (error) {
      console.error(error)
      addItem(product)
    }
  }

  return { handleToggleWishlist, handleRemoveWishlist, hasItem }
}
