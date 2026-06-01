/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { CartItemInput } from "@/store/cartTypes"

export type WishlistItem = CartItemInput & {
  addedAt: number
}

type WishlistState = {
  items: WishlistItem[]
  setWishlist: (items: WishlistItem[]) => void
  addItem: (item: CartItemInput) => void
  removeItem: (productId: string, dbProductId?: string) => void
  toggleItem: (item: CartItemInput) => void
  hasItem: (productId: string, dbProductId?: string) => boolean
  clearWishlist: () => void
}

function getBaseProductIdentity(productId: string) {
  return productId.includes(":") ? productId.slice(0, productId.indexOf(":")) : productId
}

function sameWishlistItem(
  a: Pick<WishlistItem, "productId" | "dbProductId">,
  b: Pick<CartItemInput, "productId" | "dbProductId">,
) {
  if (a.dbProductId && b.dbProductId) {
    return a.dbProductId === b.dbProductId
  }

  return getBaseProductIdentity(a.productId) === getBaseProductIdentity(b.productId)
}

function normalizeWishlistItems(items: WishlistItem[]) {
  return items.reduce<WishlistItem[]>((normalizedItems, item) => {
    const existingIndex = normalizedItems.findIndex((existingItem) =>
      sameWishlistItem(existingItem, item),
    )

    if (existingIndex === -1) {
      normalizedItems.push(item)
      return normalizedItems
    }

    const existingItem = normalizedItems[existingIndex]

    normalizedItems[existingIndex] = {
      ...existingItem,
      ...item,
      addedAt: existingItem.addedAt,
    }

    return normalizedItems
  }, [])
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      setWishlist: (items) =>
        set({ items: Array.isArray(items) ? normalizeWishlistItems(items) : [] }),

      addItem: (item) =>
        set((state) => {
          const safeItems = Array.isArray(state.items) ? state.items : []
          const existingIndex = safeItems.findIndex((existingItem) =>
            sameWishlistItem(existingItem, item),
          )

          if (existingIndex !== -1) {
            return {
              items: safeItems.map((existingItem, index) =>
                index === existingIndex
                  ? {
                      ...existingItem,
                      ...item,
                      addedAt: existingItem.addedAt,
                    }
                  : existingItem,
              ),
            }
          }

          return {
            items: [...safeItems, { ...item, addedAt: Date.now() }],
          }
        }),

      removeItem: (productId, dbProductId) =>
        set((state) => ({
          items: (Array.isArray(state.items) ? state.items : []).filter(
            (item) => !sameWishlistItem(item, { productId, dbProductId })
          ),
        })),

      toggleItem: (item) => {
        if (get().hasItem(item.productId, item.dbProductId)) {
          get().removeItem(item.productId, item.dbProductId)
          return
        }

        get().addItem(item)
      },

      hasItem: (productId, dbProductId) =>
        (Array.isArray(get().items) ? get().items : []).some(
          (item) => sameWishlistItem(item, { productId, dbProductId })
        ),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "roopshree-wishlist",
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        items: Array.isArray(persistedState?.items)
          ? normalizeWishlistItems(persistedState.items)
          : [],
      }),
    }
  )
)
