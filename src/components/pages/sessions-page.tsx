'use client'

import { useState } from 'react'
import { useAppState } from '@/hooks/use-app-state'
import { MemberTag } from '@/components/tags/member-tag'
import { DateCard } from '@/components/cards/date-card'
import { AddSessionDialog } from '@/components/modals/add-session-dialog'
import { EditDateDialog } from '@/components/modals/edit-date-dialog'
import { ConfirmDeleteDialog } from '@/components/modals/confirm-delete-dialog'
import { Fab } from '@/components/fab'
import { getAttendanceStatus } from '@/lib/parse-raw-data'
import { api } from '@/lib/api'
import { saveCache } from '@/lib/cache'

export function SessionsPage() {
  const { state, dispatch, refreshCurrentSheet } = useAppState()
  const [showAddSession, setShowAddSession] = useState(false)
  const [editDateIndex, setEditDateIndex] = useState<number | null>(null)
  const [deleteDateIndex, setDeleteDateIndex] = useState<number | null>(null)

  const { parsedData, currentSheet, selectedTagDateIndex } = state
  if (!parsedData || !currentSheet) return null

  const { dates, members } = parsedData

  // Get member tags status for selected date
  const getTagStatus = (member: typeof members[0]) => {
    if (selectedTagDateIndex === null || !dates[selectedTagDateIndex]) return 'none' as const
    const dateLabel = dates[selectedTagDateIndex].label
    const val = member.attendance[dateLabel] || ''
    return getAttendanceStatus(val)
  }

  // Date stats
  const getDateStats = (dateIndex: number) => {
    const dateLabel = dates[dateIndex].label
    let marked = 0
    let present = 0
    members.forEach((m) => {
      const val = m.attendance[dateLabel] || ''
      if (val) {
        marked++
        const s = getAttendanceStatus(val)
        if (s === 'present') present++
      }
    })
    return { marked, present, total: members.length }
  }

  const handleAddSession = async (dateLabel: string) => {
    dispatch({ type: 'SET_LOADING', loading: true })
    const newCol = dates.length > 0 ? dates[dates.length - 1].col + 1 : parsedData.dateCol + 1
    await api.write(currentSheet, parsedData.dateRow, newCol + 1, dateLabel)
    saveCache(`raw_${currentSheet}`, null)
    await refreshCurrentSheet()
    dispatch({ type: 'SET_LOADING', loading: false })
  }

  const handleEditDate = async (newLabel: string) => {
    if (editDateIndex === null) return
    dispatch({ type: 'SET_LOADING', loading: true })
    const date = dates[editDateIndex]
    await api.update(currentSheet, parsedData.dateRow, date.col + 1, newLabel)
    saveCache(`raw_${currentSheet}`, null)
    await refreshCurrentSheet()
    dispatch({ type: 'SET_LOADING', loading: false })
    setEditDateIndex(null)
  }

  const handleDeleteDate = async () => {
    if (deleteDateIndex === null) return
    dispatch({ type: 'SET_LOADING', loading: true })
    const date = dates[deleteDateIndex]
    await api.deleteCol(currentSheet, date.col + 1)
    saveCache(`raw_${currentSheet}`, null)
    await refreshCurrentSheet()
    dispatch({ type: 'SET_LOADING', loading: false })
    setDeleteDateIndex(null)
    if (selectedTagDateIndex === deleteDateIndex) {
      dispatch({ type: 'SELECT_DATE', index: null })
    }
  }

  return (
    <>
      {/* Member Tags Section */}
      <div className="mb-6">
        <h2 className="mb-2.5 pl-0.5 text-xs font-bold uppercase tracking-widest text-accent-dark">
          班員名單
        </h2>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <MemberTag key={m.row} name={m.name} status={getTagStatus(m)} />
          ))}
        </div>
      </div>

      {/* Date Cards Section */}
      <div>
        <h2 className="mb-2.5 pl-0.5 text-xs font-bold uppercase tracking-widest text-accent-dark">
          點名紀錄
        </h2>
        <div className="flex flex-col gap-2.5">
          {dates.length === 0 && (
            <div className="py-12 text-center text-text-secondary">
              <p className="text-[15px]">尚無點名紀錄，點右下角 + 新增</p>
            </div>
          )}
          {[...dates].reverse().map((date, reversedIdx) => {
            const actualIdx = dates.length - 1 - reversedIdx
            const stats = getDateStats(actualIdx)
            return (
              <DateCard
                key={date.col}
                label={date.label}
                totalMembers={stats.total}
                markedCount={stats.marked}
                presentCount={stats.present}
                isSelected={selectedTagDateIndex === actualIdx}
                onSelect={() => dispatch({ type: 'SELECT_DATE', index: actualIdx })}
                onAttend={() => dispatch({ type: 'OPEN_DATE', index: actualIdx })}
                onEdit={() => setEditDateIndex(actualIdx)}
                onDelete={() => setDeleteDateIndex(actualIdx)}
              />
            )
          })}
        </div>
      </div>

      <Fab onClick={() => setShowAddSession(true)} />

      <AddSessionDialog
        open={showAddSession}
        onOpenChange={setShowAddSession}
        onAdd={handleAddSession}
      />

      {editDateIndex !== null && (
        <EditDateDialog
          open={true}
          onOpenChange={(open) => !open && setEditDateIndex(null)}
          currentLabel={dates[editDateIndex]?.label || ''}
          onSave={handleEditDate}
        />
      )}

      <ConfirmDeleteDialog
        open={deleteDateIndex !== null}
        onOpenChange={(open) => !open && setDeleteDateIndex(null)}
        title="刪除日期"
        description={`確定要刪除「${deleteDateIndex !== null ? dates[deleteDateIndex]?.label : ''}」的所有出席紀錄嗎？`}
        onConfirm={handleDeleteDate}
      />
    </>
  )
}
