'use client'

import { Pencil, Trash2, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DateCardProps {
  label: string
  totalMembers: number
  markedCount: number
  presentCount: number
  isSelected: boolean
  onSelect: () => void
  onAttend: () => void
  onEdit: () => void
  onDelete: () => void
}

export function DateCard({
  label,
  totalMembers,
  markedCount,
  presentCount,
  isSelected,
  onSelect,
  onAttend,
  onEdit,
  onDelete,
}: DateCardProps) {
  return (
    <Card
      className={cn(
        'relative flex cursor-pointer items-center justify-between overflow-hidden px-[18px] py-4',
        'active:scale-[0.98] active:shadow-[0_1px_4px_rgba(44,62,45,0.05)]',
        isSelected && 'border-blue bg-white/92 shadow-[0_4px_20px_rgba(91,141,184,0.15)]'
      )}
      onClick={onSelect}
    >
      {/* Left accent bar */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-[3.5px] rounded-r bg-gradient-to-b from-blue-light to-blue transition-opacity',
          isSelected ? 'opacity-100' : 'opacity-0'
        )}
      />

      <div>
        <div className="text-base font-semibold text-text">{label}</div>
        <div className="mt-1 text-[13px] text-text-secondary">
          已標記 {markedCount}/{totalMembers} · 出席 {presentCount}
        </div>
      </div>

      <div className="flex items-center gap-1 ml-2">
        {isSelected && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit() }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary opacity-60 transition-all active:bg-primary-glow active:text-primary-dark active:opacity-100"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary opacity-60 transition-all active:bg-[rgba(199,91,91,0.1)] active:text-[#8B2E2E] active:opacity-100"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onAttend() }}
              className="ml-1 animate-slide-in-right rounded-[10px] bg-gradient-to-br from-accent-light to-accent px-[18px] py-2 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(224,135,92,0.35)] tracking-wide active:scale-95 active:opacity-85"
            >
              點名
            </button>
          </>
        )}
        {!isSelected && (
          <ChevronRight size={18} className="text-text-secondary opacity-50" />
        )}
      </div>
    </Card>
  )
}
