'use client'

import { Plus } from 'lucide-react'
import { useAppState } from '@/hooks/use-app-state'

interface FabProps {
  onClick: () => void
}

export function Fab({ onClick }: FabProps) {
  const { state } = useAppState()

  if (state.currentPage === 'members') return null

  return (
    <button
      onClick={onClick}
      className="fixed bottom-[calc(28px+env(safe-area-inset-bottom))] right-6 z-50 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-gradient-to-br from-accent-light to-accent text-white shadow-[0_4px_16px_rgba(224,135,92,0.4)] transition-all active:scale-90"
    >
      <Plus size={24} />
    </button>
  )
}
