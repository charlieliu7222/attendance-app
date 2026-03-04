'use client'

import { useState, useEffect, useCallback } from 'react'
import { APP_PASSWORD } from '@/lib/constants'

export function useSessionLock() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    const unlocked = sessionStorage.getItem('att_unlocked')
    if (unlocked === '1') setIsUnlocked(true)
  }, [])

  const unlock = useCallback((password: string): boolean => {
    if (password === APP_PASSWORD) {
      sessionStorage.setItem('att_unlocked', '1')
      setIsUnlocked(true)
      return true
    }
    return false
  }, [])

  return { isUnlocked, unlock }
}
