'use client'

import { Header } from '@/components/header'
import { OfflineBanner } from '@/components/offline-banner'
import { LoadingOverlay } from '@/components/loading-overlay'
import { MeetingsPage } from '@/components/pages/meetings-page'
import { SessionsPage } from '@/components/pages/sessions-page'
import { MembersPage } from '@/components/pages/members-page'
import { useAppState } from '@/hooks/use-app-state'

export function AppShell() {
  const { state } = useAppState()

  return (
    <>
      <Header />
      <main className="pt-[calc(56px_+_env(safe-area-inset-top,0px)_+_20px)] pb-[calc(88px_+_env(safe-area-inset-bottom,0px))] px-4">
        {state.currentPage === 'meetings' && <MeetingsPage />}
        {state.currentPage === 'sessions' && <SessionsPage />}
        {state.currentPage === 'members' && <MembersPage />}
      </main>
      <OfflineBanner />
      {state.isLoading && <LoadingOverlay />}
    </>
  )
}
