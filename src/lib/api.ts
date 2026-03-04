import { API_URL, API_URL_2 } from './constants'
import type { ApiResponse } from '@/types'

// ---- 第一個 Google Sheet API（出席點名系統） ----

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

  renameSheet: (sheet: string, newName: string) =>
    apiCall({ action: 'renameSheet', sheet, newName }),

  deleteCol: (sheet: string, col: number) =>
    apiCall({ action: 'deleteCol', sheet, col: String(col) }),
}

// ---- 第二個 Google Sheet API（帶便當 / 用餐統計） ----

async function api2Call<T = unknown>(
  params: Record<string, string>,
  silent = false
): Promise<ApiResponse<T> | null> {
  if (!API_URL_2) return null
  const url = `${API_URL_2}?${new URLSearchParams(params).toString()}`
  try {
    const res = await fetch(url)
    const data: ApiResponse<T> = await res.json()
    if (!data.success) {
      if (!silent) console.error('API2 Error:', data.error)
      return null
    }
    return data
  } catch (err) {
    if (!silent) console.error('API2 Network error:', err)
    return null
  }
}

export const api2 = {
  /** 是否已設定第二個 API URL */
  isConfigured: () => !!API_URL_2,

  /** 取得所有分頁名稱（每個分頁 = 一次班會日期） */
  getSheets: () => api2Call<never>({ action: 'getSheets' }),

  /** 取得某分頁原始資料 */
  getRaw: (sheet: string) =>
    api2Call<string[][]>({ action: 'getRaw', sheet }),
  getRawSilent: (sheet: string) =>
    api2Call<string[][]>({ action: 'getRaw', sheet }, true),

  /** 根據名字更新帶便當狀態 */
  updateLunch: (sheet: string, name: string, value: string) =>
    api2Call({ action: 'updateLunch', sheet, name, value }),
}
