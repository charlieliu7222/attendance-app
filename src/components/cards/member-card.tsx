'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { AttendanceStatus } from '@/types'

interface MemberCardProps {
  name: string
  status: AttendanceStatus
  reason?: string
  hasLunch?: boolean
  onSetStatus: (status: 'present' | 'late' | 'absent') => void
  onToggleLunch?: () => void
}

const statusLabels: Record<AttendanceStatus, string> = {
  present: '出席',
  late: '遲到',
  absent: '缺席',
  none: '未標記',
}

const badgeVariant: Record<AttendanceStatus, 'present' | 'late' | 'absent' | 'default'> = {
  present: 'present',
  late: 'late',
  absent: 'absent',
  none: 'default',
}

export function MemberCard({ name, status, reason, hasLunch, onSetStatus, onToggleLunch }: MemberCardProps) {
  return (
    <Card className="p-[14px_18px]">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-base font-semibold text-text">{name}</span>
        <div className="flex items-center gap-1.5">
          <Badge variant={badgeVariant[status]}>{statusLabels[status]}</Badge>
          {hasLunch && (
            <Badge variant="lunch">用餐</Badge>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {/* 出席 */}
        <button
          onClick={() => onSetStatus('present')}
          className={cn(
            'flex-1 rounded-[10px] border-2 py-2.5 text-sm font-medium transition-all active:scale-95 cursor-pointer',
            status === 'present'
              ? 'border-success bg-[rgba(74,158,111,0.1)] text-[#2D6E4A] shadow-[0_2px_8px_rgba(74,158,111,0.15)]'
              : 'border-border bg-white/60 text-text-secondary'
          )}
        >
          出席
        </button>

        {/* 用餐 — 獨立 toggle */}
        {onToggleLunch && (
          <button
            onClick={onToggleLunch}
            className={cn(
              'flex-1 rounded-[10px] border-2 py-2.5 text-sm font-medium transition-all active:scale-95 cursor-pointer',
              hasLunch
                ? 'border-[#5B9EAA] bg-[rgba(91,158,170,0.1)] text-[#2D616E] shadow-[0_2px_8px_rgba(91,158,170,0.15)]'
                : 'border-border bg-white/60 text-text-secondary'
            )}
          >
            用餐
          </button>
        )}

        {/* 遲到 */}
        <button
          onClick={() => onSetStatus('late')}
          className={cn(
            'flex-1 rounded-[10px] border-2 py-2.5 text-sm font-medium transition-all active:scale-95 cursor-pointer',
            status === 'late'
              ? 'border-warning bg-[rgba(212,162,78,0.12)] text-[#8B6914] shadow-[0_2px_8px_rgba(212,162,78,0.15)]'
              : 'border-border bg-white/60 text-text-secondary'
          )}
        >
          遲到
        </button>

        {/* 缺席 */}
        <button
          onClick={() => onSetStatus('absent')}
          className={cn(
            'flex-1 rounded-[10px] border-2 py-2.5 text-sm font-medium transition-all active:scale-95 cursor-pointer',
            status === 'absent'
              ? 'border-danger bg-[rgba(199,91,91,0.1)] text-[#8B2E2E] shadow-[0_2px_8px_rgba(199,91,91,0.15)]'
              : 'border-border bg-white/60 text-text-secondary'
          )}
        >
          缺席
        </button>
      </div>

      {status === 'absent' && reason && (
        <div className="mt-2 rounded-lg border-l-[3px] border-[rgba(199,91,91,0.3)] bg-[rgba(199,91,91,0.06)] px-3.5 py-2 text-[13px] text-[#8B2E2E]">
          原因：{reason}
        </div>
      )}
    </Card>
  )
}
