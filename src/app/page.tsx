'use client'

import { useEffect, useState } from 'react'
import { LockScreen } from '@/components/lock-screen'
import { AppShell } from '@/components/app-shell'
import { AppStateProvider } from '@/hooks/use-app-state'
import { useSessionLock } from '@/hooks/use-session-lock'

function AppContent() {
  const { isUnlocked, unlock } = useSessionLock()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {})
    }
  }, [])

  if (!mounted) return null

  if (!isUnlocked) {
    return <LockScreen onUnlock={unlock} />
  }

  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  )
}

export default function Home() {
  return <AppContent />
}
