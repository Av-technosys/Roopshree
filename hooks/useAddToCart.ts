"use client"

import { useRouter } from "next/navigation"

import {
  getUserCartItems,
  setUserCartItemQuantity,
} from "@/actions/cart.action"
import { useToast } from "@/components/common/ToastProvider"
import { useCartStore } from "@/store/cartStore"
import type { CartItem, CartItemInput } from "@/store/cartTypes"

const CART_SYNC_DEBOUNCE_MS = 500

type PendingSync = ReturnType<typeof setTimeout>
type PendingSettleSync = ReturnType<typeof setTimeout>
type CartSyncItem = Pick<
  CartItem,
  "productId" | "dbProductId" | "variantId" | "attributes"
> & {
  quantity: number
}

const pendingSyncs = new Map<string, PendingSync>()
const syncVersions = new Map<string, number>()
const syncItems = new Map<string, CartSyncItem>()
let activeSyncCount = 0
let pendingSettleSync: PendingSettleSync | null = null
let localCartVersion = 0

function getCartItemKey(item: CartItem | CartItemInput) {
  const variantId = getVariantIdentity(item)

  if (variantId) {
    return `${item.dbProductId ?? item.productId}:${variantId}`
  }

  const attributes = getNormalizedAttributes(item.attributes)

  return `${item.dbProductId ?? item.productId}:${item.variantId ?? "default"}:${JSON.stringify(attributes)}`
}

function getVariantIdentity(item: { productId: string; variantId?: string | null }) {
  if (item.variantId) return item.variantId

  const variantId = item.productId.includes(":")
    ? item.productId.slice(item.productId.lastIndexOf(":") + 1)
    : null

  return variantId && variantId !== "default" ? variantId : null
}

function getNormalizedAttributes(attributes?: CartItem["attributes"]) {
  return (attributes ?? [])
    .slice()
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
}

export function useAddToCart() {
  const router = useRouter()
  const addItemOptimistic = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const increaseOptimistic = useCartStore((state) => state.increase)
  const decreaseOptimistic = useCartStore((state) => state.decrease)
  const setCart = useCartStore((state) => state.setCart)
  const { showToast } = useToast()

  function redirectToAuth() {
    router.push("/auth")
  }

  function getQuantityLimit(item: CartItem | CartItemInput) {
    return Math.max(0, item.stockQuantity ?? 10)
  }

  function showQuantityLimitToast(item: CartItem | CartItemInput) {
    const limit = getQuantityLimit(item)

    if (limit <= 0) {
      showToast({ title: "This item is out of stock", tone: "error" })
      return
    }

    showToast({
      title: `Only ${limit} item${limit === 1 ? "" : "s"} available`,
      tone: "info",
    })
  }

  async function syncCartFromDb(options?: { force?: boolean }) {
    const syncStartedAtVersion = localCartVersion
    const updatedCart = await getUserCartItems()

    if (updatedCart.success) {
      if (
        !options?.force &&
        (syncStartedAtVersion !== localCartVersion ||
          pendingSyncs.size > 0 ||
          activeSyncCount > 0)
      ) {
        return
      }

      setCart(updatedCart.items)
    }
  }

  function scheduleSettledCartSync() {
    if (pendingSettleSync) {
      clearTimeout(pendingSettleSync)
    }

    pendingSettleSync = setTimeout(async () => {
      pendingSettleSync = null

      if (pendingSyncs.size > 0 || activeSyncCount > 0) {
        scheduleSettledCartSync()
        return
      }

      await syncCartFromDb()
    }, CART_SYNC_DEBOUNCE_MS)
  }

  function debouncedSyncItem(item: CartItem | CartItemInput) {
    if (!item.dbProductId) {
      showToast({ title: "Unable to sync this cart item", tone: "error" })
      return false
    }

    const key = getCartItemKey(item)
    const existingTimer = pendingSyncs.get(key)

    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    const nextVersion = (syncVersions.get(key) ?? 0) + 1
    const quantity = useCartStore
      .getState()
      .getItemQuantity(item.productId, item.attributes, item.variantId)
    const variantId = getVariantIdentity(item)

    syncVersions.set(key, nextVersion)
    syncItems.set(key, {
      productId: item.productId,
      dbProductId: item.dbProductId,
      variantId: variantId ?? undefined,
      attributes: item.attributes,
      quantity,
    })

    const timer = setTimeout(async () => {
      pendingSyncs.delete(key)
      const syncItem = syncItems.get(key)

      if (!syncItem?.dbProductId) {
        return
      }

      try {
        activeSyncCount += 1

        const result = await setUserCartItemQuantity({
          productId: syncItem.dbProductId,
          variantId: syncItem.variantId,
          quantity: syncItem.quantity,
        })

        if (syncVersions.get(key) !== nextVersion) {
          return
        }

        syncItems.delete(key)

        if (result.userIsNotLoggedIn) {
          showToast({ title: "Please sign in to update your cart", tone: "info" })
          await syncCartFromDb({ force: true })
          redirectToAuth()
          return
        }

        if (!result.success) {
          console.error(result.message ?? "Cart sync failed")
          showToast({
            title: result.message ?? "Unable to update cart",
            tone: "error",
          })
          await syncCartFromDb({ force: true })
          return
        }

        scheduleSettledCartSync()
      } catch (error) {
        console.error(error)
        showToast({ title: "Unable to update cart", tone: "error" })

        if (syncVersions.get(key) === nextVersion) {
          syncItems.delete(key)
          await syncCartFromDb({ force: true })
        }
      } finally {
        activeSyncCount = Math.max(0, activeSyncCount - 1)
      }
    }, CART_SYNC_DEBOUNCE_MS)

    pendingSyncs.set(key, timer)
    return true
  }

  async function syncItemNow(item: CartItem | CartItemInput) {
    if (!item.dbProductId) {
      showToast({ title: "Unable to sync this cart item", tone: "error" })
      return false
    }

    const key = getCartItemKey(item)
    const existingTimer = pendingSyncs.get(key)

    if (existingTimer) {
      clearTimeout(existingTimer)
      pendingSyncs.delete(key)
    }

    const nextVersion = (syncVersions.get(key) ?? 0) + 1
    const quantity = useCartStore
      .getState()
      .getItemQuantity(item.productId, item.attributes, item.variantId)
    const variantId = getVariantIdentity(item)

    syncVersions.set(key, nextVersion)
    syncItems.set(key, {
      productId: item.productId,
      dbProductId: item.dbProductId,
      variantId: variantId ?? undefined,
      attributes: item.attributes,
      quantity,
    })

    try {
      activeSyncCount += 1

      const result = await setUserCartItemQuantity({
        productId: item.dbProductId,
        variantId: variantId ?? undefined,
        quantity,
      })

      if (syncVersions.get(key) !== nextVersion) {
        return true
      }

      syncItems.delete(key)

      if (result.userIsNotLoggedIn) {
        showToast({ title: "Please sign in to update your cart", tone: "info" })
        await syncCartFromDb({ force: true })
        redirectToAuth()
        return false
      }

      if (!result.success) {
        console.error(result.message ?? "Cart sync failed")
        showToast({
          title: result.message ?? "Unable to update cart",
          tone: "error",
        })
        await syncCartFromDb({ force: true })
        return false
      }

      scheduleSettledCartSync()
      return true
    } catch (error) {
      console.error(error)
      showToast({ title: "Unable to update cart", tone: "error" })

      if (syncVersions.get(key) === nextVersion) {
        syncItems.delete(key)
        await syncCartFromDb({ force: true })
        return false
      }

      return true
    } finally {
      activeSyncCount = Math.max(0, activeSyncCount - 1)
    }
  }

  async function handleAddToCart(product: CartItemInput) {
    const previousItems = useCartStore.getState().items

    const previousQuantity = useCartStore
      .getState()
      .getItemQuantity(product.productId, product.attributes, product.variantId)

    addItemOptimistic(product)
    localCartVersion += 1
    const nextQuantity = useCartStore
      .getState()
      .getItemQuantity(product.productId, product.attributes, product.variantId)

    if (nextQuantity === previousQuantity) {
      showQuantityLimitToast(product)
    }

    if (!debouncedSyncItem(product)) {
      setCart(previousItems)
      return false
    }

    return true
  }

  async function handleIncreaseCartItem(item: CartItem | CartItemInput) {
    const previousItems = useCartStore.getState().items

    const previousQuantity = useCartStore
      .getState()
      .getItemQuantity(item.productId, item.attributes, item.variantId)

    increaseOptimistic(item.productId, item.attributes, item.variantId)
    localCartVersion += 1
    const nextQuantity = useCartStore
      .getState()
      .getItemQuantity(item.productId, item.attributes, item.variantId)

    if (nextQuantity === previousQuantity) {
      showQuantityLimitToast(item)
    }

    if (!debouncedSyncItem(item)) {
      setCart(previousItems)
      return false
    }

    return true
  }

  async function handleDecreaseCartItem(item: CartItem | CartItemInput) {
    const previousItems = useCartStore.getState().items

    decreaseOptimistic(item.productId, item.attributes, item.variantId)
    localCartVersion += 1

    const nextQuantity = useCartStore
      .getState()
      .getItemQuantity(item.productId, item.attributes, item.variantId)
    const syncSucceeded =
      nextQuantity <= 0 ? await syncItemNow(item) : debouncedSyncItem(item)

    if (!syncSucceeded) {
      setCart(previousItems)
      return false
    }

    return true
  }

  async function handleRemoveCartItem(item: CartItem | CartItemInput) {
    const previousItems = useCartStore.getState().items

    removeItem(item.productId, item.attributes, item.variantId)
    localCartVersion += 1

    if (!(await syncItemNow(item))) {
      setCart(previousItems)
      return false
    }

    return true
  }

  return {
    handleAddToCart,
    handleIncreaseCartItem,
    handleDecreaseCartItem,
    handleRemoveCartItem,
  }
}
