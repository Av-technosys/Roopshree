import {
  deleteCategoryRecord,
  findCategories,
  findCategoriesPage,
  findCategoryMeta,
  insertCategoryRecord,
  updateCategoryRecord,
} from '@/repositories/category.repository'
import type { CategoryPayload, CategoryQuery } from '@/validators/category.validator'

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getCategoriesService() {
  return findCategories()
}

export async function getAllCategoriesMetaService() {
  return findCategoryMeta()
}

export async function getCategoriesPaginationService(query: CategoryQuery) {
  return findCategoriesPage(query)
}

export async function createCategoryService(payload: CategoryPayload) {
  await insertCategoryRecord({
    ...payload,
    slug: slugify(payload.name),
  })
}

export async function updateCategoryService(payload: CategoryPayload & { id: string }) {
  await updateCategoryRecord({
    ...payload,
    slug: slugify(payload.name),
  })
}

export async function deleteCategoryService(id: string) {
  await deleteCategoryRecord(id)
}
