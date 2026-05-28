/* eslint-disable @typescript-eslint/no-explicit-any */

export async function apiFetch<T = any>(
  path: string,
  init?: RequestInit,
): Promise<{ status: number; data: T }> {
  const response = await fetch(path, init);
  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? ((await response.json()) as T)
    : ((await response.text()) as T);

  return {
    status: response.status,
    data,
  };
}
