'use client'

import { useAppState } from '@/hooks/use-app-state'
import { ChevronLeft } from 'lucide-react'

export function Header() {
  const { state, dispatch } = useAppState()
  const showBack = state.currentPage !== 'meetings'

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex h-[calc(56px+env(safe-area-inset-top))] items-center px-2 pt-[env(safe-area-inset-top)] glass-header border-b border-[rgba(74,158,111,0.08)]">
      {showBack ? (
        <button
          onClick={() => dispatch({ type: 'GO_BACK' })}
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors active:bg-primary-glow"
        >
          <ChevronLeft size={22} />
        </button>
      ) : (
        <div className="w-10" />
      )}

      <h1 className="flex-1 text-center text-[17px] font-semibold tracking-wide text-primary-dark">
        {state.headerTitle}
      </h1>

      <div className="w-10" />
    </header>
  )
}
