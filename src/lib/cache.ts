import { CACHE_PREFIX, CACHE_TTL } from './constants'

export function saveCache(key: string, data: unknown): void {
  try {
    if (data === null) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return
    }
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ ts: Date.now(), d: data })
    )
  } catch {
    /* ignore quota errors */
  }
}

export function loadCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const obj = JSON.parse(raw)
    if (Date.now() - obj.ts > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }
    return obj.d as T
  } catch {
    return null
  }
}
