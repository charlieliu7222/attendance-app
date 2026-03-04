'use client'

import { useState } from 'react'
import { useAppState } from '@/hooks/use-app-state'
import { MemberCard } from '@/components/cards/member-card'
import { AbsenceReasonDialog } from '@/components/modals/absence-reason-dialog'
import { getAttendanceStatus } from '@/lib/parse-raw-data'
import { api } from '@/lib/api'

export function MembersPage() {
  const { state, dispatch } = useAppState()
  const [reasonMemberIdx, setReasonMemberIdx] = useState<number | null>(null)

  const { parsedData, currentSheet, currentDateIndex } = state
  if (!parsedData || currentDateIndex === null || !currentSheet) return null

  const { dates, members } = parsedData
  const currentDate = dates[currentDateIndex]
  if (!currentDate) return null

  const dateLabel = currentDate.label

  const handleSetStatus = async (memberIndex: number, status: 'present' | 'late' | 'absent') => {
    const member = members[memberIndex]
    if (!member) return

    if (status === 'absent') {
      // Open reason dialog
      setReasonMemberIdx(memberIndex)
      return
    }

    const value = status === 'present' ? 'v' : '△'

    // Optimistic update
    dispatch({
      type: 'UPDATE_MEMBER_ATTENDANCE',
      memberIndex,
      dateLabel,
      value,
    })

    // Fire API call in background
    await api.update(currentSheet, member.row, currentDate.col + 1, value)
  }

  const handleAbsenceReason = async (reason: string) => {
    if (reasonMemberIdx === null) return
    const member = members[reasonMemberIdx]
    if (!member) return

    const value = reason || '缺席'

    // Optimistic update
    dispatch({
      type: 'UPDATE_MEMBER_ATTENDANCE',
      memberIndex: reasonMemberIdx,
      dateLabel,
      value,
    })

    // Fire API call
    await api.update(currentSheet, member.row, currentDate.col + 1, value)
    setReasonMemberIdx(null)
  }

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {members.map((member, idx) => {
          const rawVal = member.attendance[dateLabel] || ''
          const status = getAttendanceStatus(rawVal)
          const reason = status === 'absent' && rawVal !== '缺席' ? rawVal : undefined

          return (
            <MemberCard
              key={member.row}
              name={member.name}
              status={status}
              reason={reason}
              onSetStatus={(s) => handleSetStatus(idx, s)}
            />
          )
        })}
      </div>

      <AbsenceReasonDialog
        open={reasonMemberIdx !== null}
        onOpenChange={(open) => !open && setReasonMemberIdx(null)}
        memberName={reasonMemberIdx !== null ? members[reasonMemberIdx]?.name || '' : ''}
        currentReason={
          reasonMemberIdx !== null
            ? (() => {
                const val = members[reasonMemberIdx]?.attendance[dateLabel] || ''
                const s = getAttendanceStatus(val)
                return s === 'absent' && val !== '缺席' ? val : ''
              })()
            : ''
        }
        onSave={handleAbsenceReason}
      />
    </>
  )
}
