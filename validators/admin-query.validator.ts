export type PaginatedQuery = {
  page?: number
  pageSize?: number
  search?: string
}

export type OrderQuery = PaginatedQuery & {
  status?: string
}

export type PaymentQuery = PaginatedQuery & {
  paymentStatus?: string
}

export function validateOrderQuery(query: unknown): OrderQuery {
  const data = query as Partial<OrderQuery>

  return {
    page: Number(data.page ?? 1),
    pageSize: Number(data.pageSize ?? 10),
    search: data.search,
    status: data.status,
  }
}

export function validatePaymentQuery(query: unknown): PaymentQuery {
  const data = query as Partial<PaymentQuery>

  return {
    page: Number(data.page ?? 1),
    pageSize: Number(data.pageSize ?? 10),
    search: data.search,
    paymentStatus: data.paymentStatus,
  }
}
