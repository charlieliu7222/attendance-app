'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { AttendanceStatus } from '@/types'

interface MemberCardProps {
  name: string
  status: AttendanceStatus
  reason?: string
  onSetStatus: (status: 'present' | 'late' | 'absent') => void
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

export function MemberCard({ name, status, reason, onSetStatus }: MemberCardProps) {
  return (
    <Card className="p-[14px_18px]">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-base font-semibold text-text">{name}</span>
        <Badge variant={badgeVariant[status]}>{statusLabels[status]}</Badge>
      </div>

      <div className="flex gap-2">
        {(['present', 'late', 'absent'] as const).map((s) => (
          <button
            key={s}
            onClick={() => onSetStatus(s)}
            className={cn(
              'flex-1 rounded-[10px] border-2 py-2.5 text-sm font-medium transition-all active:scale-95 cursor-pointer',
              status === s
                ? s === 'present'
                  ? 'border-success bg-[rgba(74,158,111,0.1)] text-[#2D6E4A] shadow-[0_2px_8px_rgba(74,158,111,0.15)]'
                  : s === 'late'
                  ? 'border-warning bg-[rgba(212,162,78,0.12)] text-[#8B6914] shadow-[0_2px_8px_rgba(212,162,78,0.15)]'
                  : 'border-danger bg-[rgba(199,91,91,0.1)] text-[#8B2E2E] shadow-[0_2px_8px_rgba(199,91,91,0.15)]'
                : 'border-border bg-white/60 text-text-secondary'
            )}
          >
            {s === 'present' ? '出席' : s === 'late' ? '遲到' : '缺席'}
          </button>
        ))}
      </div>

      {status === 'absent' && reason && (
        <div className="mt-2 rounded-lg border-l-[3px] border-[rgba(199,91,91,0.3)] bg-[rgba(199,91,91,0.06)] px-3.5 py-2 text-[13px] text-[#8B2E2E]">
          原因：{reason}
        </div>
      )}
    </Card>
  )
}
