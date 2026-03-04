'use client'

import { cn } from '@/lib/utils'
import type { AttendanceStatus } from '@/types'

interface MemberTagProps {
  name: string
  status: AttendanceStatus
}

const dotColors: Record<AttendanceStatus, string> = {
  present: 'bg-success shadow-[0_0_6px_rgba(74,158,111,0.4)]',
  late: 'bg-warning shadow-[0_0_6px_rgba(212,162,78,0.4)]',
  absent: 'bg-danger shadow-[0_0_6px_rgba(199,91,91,0.4)]',
  none: 'bg-[#C5CCC6]',
}

const borderColors: Record<AttendanceStatus, string> = {
  present: 'border-[rgba(74,158,111,0.25)]',
  late: 'border-[rgba(212,162,78,0.3)]',
  absent: 'border-[rgba(199,91,91,0.25)]',
  none: 'border-white/50',
}

export function MemberTag({ name, status }: MemberTagProps) {
  return (
    <span
      className={cn(
        'relative inline-flex items-center rounded-full bg-white/92 py-1.5 pl-6 pr-3.5 text-[13px] font-medium text-text shadow-[0_1px_6px_rgba(44,62,45,0.06)] border backdrop-blur-lg transition-all',
        borderColors[status]
      )}
    >
      <span
        className={cn(
          'absolute left-2.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full',
          dotColors[status]
        )}
      />
      {name}
    </span>
  )
}
