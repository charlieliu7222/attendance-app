'use client'

import { useOnlineStatus } from '@/hooks/use-online-status'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="fixed top-[calc(56px+env(safe-area-inset-top))] left-4 right-4 z-[99] rounded-[10px] bg-danger/90 p-2.5 text-center text-sm text-white shadow-[0_4px_12px_rgba(199,91,91,0.2)] backdrop-blur-xl">
      目前離線，部分功能可能無法使用
    </div>
  )
}
