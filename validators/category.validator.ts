export type CategoryPayload = {
  id?: string
  name: string
  parentId?: string | null
  description?: string | null
  bannerImage?: string | null
}

export type CategoryQuery = {
  page?: number
  pageSize?: number
  search?: string
  category?: string
}

export function validateCategoryPayload(payload: unknown): CategoryPayload {
  const data = payload as Partial<CategoryPayload>
  const name = data.name?.trim()

  if (!name) {
    throw new Error('Category name is required')
  }

  return {
    id: data.id,
    name,
    parentId: data.parentId ?? null,
    description: data.description ?? null,
    bannerImage: data.bannerImage ?? null,
  }
}

export function validateCategoryUpdatePayload(
  payload: unknown,
): CategoryPayload & { id: string } {
  const data = validateCategoryPayload(payload)

  if (!data.id) {
    throw new Error('Category id is required')
  }

  return {
    ...data,
    id: data.id,
  }
}

export function validateCategoryQuery(query: unknown): CategoryQuery {
  const data = query as Partial<CategoryQuery>

  return {
    page: Number(data.page ?? 1),
    pageSize: Number(data.pageSize ?? 10),
    search: data.search,
    category: data.category,
  }
}
