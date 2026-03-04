'use client'

import { useState, useEffect, useRef } from 'react'
import { useAppState } from '@/hooks/use-app-state'
import { MemberCard } from '@/components/cards/member-card'
import { AbsenceReasonDialog } from '@/components/modals/absence-reason-dialog'
import { getAttendanceStatus, getLunchStatus, parseLunchSheet } from '@/lib/parse-raw-data'
import { api, api2 } from '@/lib/api'

export function MembersPage() {
  const { state, dispatch } = useAppState()
  const [reasonMemberIdx, setReasonMemberIdx] = useState<number | null>(null)
  const fetchedDateRef = useRef<string | null>(null)

  const { parsedData, currentSheet, currentDateIndex } = state
  const dates = parsedData?.dates
  const members = parsedData?.members
  const currentDate = dates && currentDateIndex !== null ? dates[currentDateIndex] : null
  const dateLabel = currentDate?.label || ''

  const hasLunchCol = currentDate?.lunchCol !== undefined
  const hasLunchApi = api2.isConfigured()
  const showLunch = hasLunchCol || hasLunchApi

  // 從第二個 Google Sheet 取得帶便當資料
  useEffect(() => {
    if (!hasLunchApi || !dateLabel || fetchedDateRef.current === dateLabel) return
    fetchedDateRef.current = dateLabel

    async function fetchLunch() {
      // 嘗試用日期 label 對應第二個 Sheet 的分頁名稱
      const res = await api2.getRawSilent(dateLabel)
      if (res?.data) {
        const lunchMap = parseLunchSheet(res.data)
        dispatch({ type: 'MERGE_LUNCH_DATA', dateLabel, lunchMap })
      }
    }

    fetchLunch()
  }, [dateLabel, hasLunchApi, dispatch])

  if (!parsedData || currentDateIndex === null || !currentSheet || !currentDate || !members) {
    return null
  }

  const handleSetStatus = async (memberIndex: number, status: 'present' | 'late' | 'absent') => {
    const member = members[memberIndex]
    if (!member) return

    if (status === 'absent') {
      setReasonMemberIdx(memberIndex)
      return
    }

    const value = status === 'present' ? 'v' : '△'

    dispatch({
      type: 'UPDATE_MEMBER_ATTENDANCE',
      memberIndex,
      dateLabel,
      value,
    })

    await api.update(currentSheet, member.row, currentDate.col + 1, value)
  }

  const handleToggleLunch = async (memberIndex: number) => {
    const member = members[memberIndex]
    if (!member) return

    const currentVal = getLunchStatus(member.lunch[dateLabel] || '')
    const newValue = currentVal ? 'x' : 'v'

    // Optimistic update
    dispatch({
      type: 'UPDATE_MEMBER_LUNCH',
      memberIndex,
      dateLabel,
      value: newValue,
    })

    // 寫入對應的 API
    if (hasLunchApi) {
      // 透過第二個 Sheet API，用名字對應更新
      await api2.updateLunch(dateLabel, member.name, newValue)
    } else if (currentDate.lunchCol) {
      // 透過第一個 Sheet API，用 row/col 更新
      await api.update(currentSheet, member.row, currentDate.lunchCol + 1, newValue)
    }
  }

  const handleAbsenceReason = async (reason: string) => {
    if (reasonMemberIdx === null) return
    const member = members[reasonMemberIdx]
    if (!member) return

    const value = reason || '缺席'

    dispatch({
      type: 'UPDATE_MEMBER_ATTENDANCE',
      memberIndex: reasonMemberIdx,
      dateLabel,
      value,
    })

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
          const hasLunch = showLunch ? getLunchStatus(member.lunch[dateLabel] || '') : undefined

          return (
            <MemberCard
              key={member.row}
              name={member.name}
              status={status}
              reason={reason}
              hasLunch={hasLunch}
              onSetStatus={(s) => handleSetStatus(idx, s)}
              onToggleLunch={showLunch ? () => handleToggleLunch(idx) : undefined}
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
