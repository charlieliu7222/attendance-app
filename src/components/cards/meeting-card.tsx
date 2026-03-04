'use client'

import { Trash2, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface MeetingCardProps {
  name: string
  onOpen: () => void
  onDelete: () => void
}

export function MeetingCard({ name, onOpen, onDelete }: MeetingCardProps) {
  return (
    <Card
      className="flex cursor-pointer items-center justify-between px-[18px] py-4 active:scale-[0.98] active:shadow-[0_1px_4px_rgba(44,62,45,0.05)]"
      onClick={onOpen}
    >
      <span className="text-base font-semibold text-text">{name}</span>
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary opacity-60 transition-all active:bg-[rgba(199,91,91,0.1)] active:text-[#8B2E2E] active:opacity-100"
        >
          <Trash2 size={16} />
        </button>
        <ChevronRight size={18} className="text-text-secondary opacity-50" />
      </div>
    </Card>
  )
}
