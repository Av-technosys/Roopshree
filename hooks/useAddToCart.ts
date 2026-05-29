"use client"

import { useRouter } from "next/navigation"

import {
  addProductToUserCart,
  changeUserCartItemQuantity,
  removeProductFromUserCart,
} from "@/actions/cart.action"
import { useCartStore } from "@/store/cartStore"
import type { CartItem, CartItemInput } from "@/store/cartTypes"

export function useAddToCart() {
  const router = useRouter()
  const addItemOptimistic = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const increaseOptimistic = useCartStore((state) => state.increase)
  const decreaseOptimistic = useCartStore((state) => state.decrease)

  function redirectToAuth() {
    router.push("/auth")
  }

  async function handleAddToCart(product: CartItemInput) {
    addItemOptimistic(product)

    if (!product.dbProductId) return true

    try {
      const result = await addProductToUserCart({
        productId: product.dbProductId,
        variantId: product.variantId,
        quantity: 1,
      })

      if (!result.success) {
        removeItem(product.productId, product.attributes)
        return false
      }

      if (result.userIsNotLoggedIn) {
        removeItem(product.productId, product.attributes)
        redirectToAuth()
        return false
      }

      return true
    } catch (error) {
      console.error(error)
      removeItem(product.productId, product.attributes)
      return false
    }
  }

  async function handleIncreaseCartItem(item: CartItem | CartItemInput) {
    increaseOptimistic(item.productId, item.attributes)

    if (!item.dbProductId) return true

    try {
      const result = await changeUserCartItemQuantity({
        productId: item.dbProductId,
        variantId: item.variantId,
        delta: 1,
      })

      if (!result.success) {
        decreaseOptimistic(item.productId, item.attributes)
        return false
      }

      if (result.userIsNotLoggedIn) {
        decreaseOptimistic(item.productId, item.attributes)
        redirectToAuth()
        return false
      }

      return true
    } catch (error) {
      console.error(error)
      decreaseOptimistic(item.productId, item.attributes)
      return false
    }
  }

  async function handleDecreaseCartItem(item: CartItem | CartItemInput) {
    decreaseOptimistic(item.productId, item.attributes)

    if (!item.dbProductId) return true

    try {
      const result = await changeUserCartItemQuantity({
        productId: item.dbProductId,
        variantId: item.variantId,
        delta: -1,
      })

      if (!result.success) {
        increaseOptimistic(item.productId, item.attributes)
        return false
      }

      if (result.userIsNotLoggedIn) {
        increaseOptimistic(item.productId, item.attributes)
        redirectToAuth()
        return false
      }

      return true
    } catch (error) {
      console.error(error)
      increaseOptimistic(item.productId, item.attributes)
      return false
    }
  }

  async function handleRemoveCartItem(item: CartItem | CartItemInput) {
    removeItem(item.productId, item.attributes)

    if (!item.dbProductId) return true

    try {
      const result = await removeProductFromUserCart({
        productId: item.dbProductId,
        variantId: item.variantId,
      })

      if (result.userIsNotLoggedIn) {
        redirectToAuth()
        return false
      }

      return result.success
    } catch (error) {
      console.error(error)
      return false
    }
  }

  return {
    handleAddToCart,
    handleIncreaseCartItem,
    handleDecreaseCartItem,
    handleRemoveCartItem,
  }
}
