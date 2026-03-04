import { API_URL } from './constants'
import type { ApiResponse } from '@/types'

async function apiCall<T = unknown>(
  params: Record<string, string>,
  silent = false
): Promise<ApiResponse<T> | null> {
  const url = `${API_URL}?${new URLSearchParams(params).toString()}`
  try {
    const res = await fetch(url)
    const data: ApiResponse<T> = await res.json()
    if (!data.success) {
      if (!silent) console.error('API Error:', data.error)
      return null
    }
    return data
  } catch (err) {
    if (!silent) console.error('Network error:', err)
    return null
  }
}

export const api = {
  getSheets: () => apiCall<never>({ action: 'getSheets' }),
  getSheetsSilent: () => apiCall<never>({ action: 'getSheets' }, true),

  getRaw: (sheet: string) =>
    apiCall<string[][]>({ action: 'getRaw', sheet }),
  getRawSilent: (sheet: string) =>
    apiCall<string[][]>({ action: 'getRaw', sheet }, true),

  update: (sheet: string, row: number, col: number, value: string) =>
    apiCall({
      action: 'update',
      sheet,
      row: String(row),
      col: String(col),
      value,
    }),

  write: (sheet: string, row: number, col: number, value: string) =>
    apiCall({
      action: 'write',
      sheet,
      row: String(row),
      col: String(col),
      value,
    }),

  addSheet: (name: string) => apiCall({ action: 'addSheet', name }),

  deleteSheet: (sheet: string) => apiCall({ action: 'deleteSheet', sheet }),

  deleteCol: (sheet: string, col: number) =>
    apiCall({ action: 'deleteCol', sheet, col: String(col) }),
}
