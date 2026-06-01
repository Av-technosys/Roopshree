/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { CartItem, CartItemInput } from "@/store/cartTypes"

type CartState = {
  items: CartItem[]
  setCart: (items: CartItem[]) => void
  addItem: (item: CartItemInput) => void
  removeItem: (
    productId: string,
    attributes?: CartItem["attributes"],
    variantId?: string | null
  ) => void
  increase: (
    productId: string,
    attributes?: CartItem["attributes"],
    variantId?: string | null
  ) => void
  decrease: (
    productId: string,
    attributes?: CartItem["attributes"],
    variantId?: string | null
  ) => void
  clearCart: () => void
  lineItems: () => number
  totalItems: () => number
  subtotal: () => number
  getItemQuantity: (
    productId: string,
    attributes?: CartItem["attributes"],
    variantId?: string | null
  ) => number
}

function normalizeAttributes(attrs?: CartItem["attributes"]) {
  return (attrs ?? [])
    .slice()
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
}

function sameVariant(
  a: CartItem,
  b: {
    productId: string
    dbProductId?: string
    variantId?: string | null
    attributes?: CartItem["attributes"]
  }
) {
  const aVariantId = getVariantIdentity(a)
  const bVariantId = getVariantIdentity(b)

  if (aVariantId && bVariantId) {
    if (a.dbProductId && b.dbProductId && a.dbProductId !== b.dbProductId) {
      return false
    }

    return aVariantId === bVariantId
  }

  if (a.productId !== b.productId) return false

  if (aVariantId || bVariantId) return true

  const aAttrs = normalizeAttributes(a.attributes)
  const bAttrs = normalizeAttributes(b.attributes)

  return JSON.stringify(aAttrs) === JSON.stringify(bAttrs)
}

function getVariantIdentity(item: { productId: string; variantId?: string | null }) {
  if (item.variantId) return item.variantId

  const variantId = item.productId.includes(":")
    ? item.productId.slice(item.productId.lastIndexOf(":") + 1)
    : null

  return variantId && variantId !== "default" ? variantId : null
}

function getMaxQuantity(item: Pick<CartItem, "stockQuantity">) {
  return Math.max(0, item.stockQuantity ?? 10)
}

function normalizeCartItems(items: CartItem[]) {
  return items.reduce<CartItem[]>((normalizedItems, item) => {
    if (item.dbProductId && !getVariantIdentity(item)) {
      return normalizedItems
    }

    const normalizedItem = {
      ...item,
      quantity: Math.min(item.quantity, getMaxQuantity(item)),
    }

    if (normalizedItem.quantity <= 0) {
      return normalizedItems
    }

    const existingIndex = normalizedItems.findIndex((existingItem) =>
      sameVariant(existingItem, normalizedItem)
    )

    if (existingIndex === -1) {
      normalizedItems.push(normalizedItem)
      return normalizedItems
    }

    const existingItem = normalizedItems[existingIndex]
    const stockQuantity = normalizedItem.stockQuantity ?? existingItem.stockQuantity
    const maxQuantity = getMaxQuantity({ stockQuantity })

    normalizedItems[existingIndex] = {
      ...existingItem,
      stockQuantity,
      attributes:
        (existingItem.attributes?.length ?? 0) >=
        (normalizedItem.attributes?.length ?? 0)
          ? existingItem.attributes
          : normalizedItem.attributes,
      quantity: Math.min(
        existingItem.quantity + normalizedItem.quantity,
        maxQuantity
      ),
    }

    return normalizedItems
  }, [])
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const safeItems = Array.isArray(state.items) ? state.items : []
          const existing = safeItems.find((i) => sameVariant(i, item))

          if (existing) {
            return {
              items: safeItems.map((i) =>
                sameVariant(i, item)
                  ? (() => {
                      const stockQuantity =
                        item.stockQuantity ?? i.stockQuantity
                      const maxQuantity = getMaxQuantity({ stockQuantity })

                      if (maxQuantity <= 0) {
                        return i
                      }

                      return {
                        ...i,
                        stockQuantity,
                        quantity: Math.min(i.quantity + 1, maxQuantity),
                      }
                    })()
                  : i
              ),
            }
          }

          const maxQuantity = getMaxQuantity(item)

          if (maxQuantity <= 0) {
            return { items: safeItems }
          }

          return {
            items: [
              ...safeItems,
              {
                ...item,
                quantity: Math.min(1, maxQuantity),
                addedAt: Date.now(),
              },
            ],
          }
        }),

      removeItem: (productId, attributes, variantId) =>
        set((state) => ({
          items: (Array.isArray(state.items) ? state.items : []).filter(
            (i) => !sameVariant(i, { productId, attributes, variantId })
          ),
        })),

      increase: (productId, attributes, variantId) =>
        set((state) => ({
          items: (Array.isArray(state.items) ? state.items : []).map((i) =>
            sameVariant(i, { productId, attributes, variantId })
              ? {
                  ...i,
                  quantity: Math.min(i.quantity + 1, getMaxQuantity(i)),
                }
              : i
          ),
        })),

      decrease: (productId, attributes, variantId) =>
        set((state) => ({
          items: (Array.isArray(state.items) ? state.items : [])
            .map((i) =>
              sameVariant(i, { productId, attributes, variantId })
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

      setCart: (items) =>
        set(() => ({
          items: Array.isArray(items) ? normalizeCartItems(items) : [],
        })),

      lineItems: () => get().items.length,

      totalItems: () =>
        (Array.isArray(get().items) ? get().items : []).reduce(
          (total, item) => total + item.quantity,
          0
        ),

      subtotal: () =>
        (Array.isArray(get().items) ? get().items : []).reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),

      getItemQuantity: (productId, attributes, variantId) =>
        (Array.isArray(get().items) ? get().items : []).find((item) =>
          sameVariant(item, { productId, attributes, variantId })
        )?.quantity ?? 0,
    }),
    {
      name: "roopshree-cart",
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        items: Array.isArray(persistedState?.items)
          ? normalizeCartItems(persistedState.items)
          : [],
      }),
    }
  )
)
