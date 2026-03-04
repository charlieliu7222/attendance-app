'use client'

import { useEffect, useState } from 'react'
import { useAppState } from '@/hooks/use-app-state'
import { MeetingCard } from '@/components/cards/meeting-card'
import { AddMeetingDialog } from '@/components/modals/add-meeting-dialog'
import { EditMeetingDialog } from '@/components/modals/edit-meeting-dialog'
import { ConfirmDeleteDialog } from '@/components/modals/confirm-delete-dialog'
import { Fab } from '@/components/fab'
import { api } from '@/lib/api'
import { saveCache } from '@/lib/cache'

export function MeetingsPage() {
  const { state, dispatch, loadMeetings, openMeeting } = useAppState()
  const [showAdd, setShowAdd] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<string | null>(null)
  const [swipedOpen, setSwipedOpen] = useState<string | null>(null)

  useEffect(() => {
    loadMeetings()
  }, [loadMeetings])

  const handleDelete = async () => {
    if (!deleteTarget) return
    dispatch({ type: 'SET_LOADING', loading: true })
    await api.deleteSheet(deleteTarget)
    dispatch({ type: 'SET_LOADING', loading: false })
    saveCache('sheets', null)
    await loadMeetings()
    setDeleteTarget(null)
    setSwipedOpen(null)
  }

  const handleEdit = async (newName: string) => {
    if (!editTarget || newName === editTarget) return
    dispatch({ type: 'SET_LOADING', loading: true })
    await api.renameSheet(editTarget, newName)
    dispatch({ type: 'SET_LOADING', loading: false })
    saveCache('sheets', null)
    await loadMeetings()
    setEditTarget(null)
    setSwipedOpen(null)
  }

  const handleAdd = async (name: string) => {
    dispatch({ type: 'SET_LOADING', loading: true })
    await api.addSheet(name)
    dispatch({ type: 'SET_LOADING', loading: false })
    saveCache('sheets', null)
    await loadMeetings()
  }

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {state.sheetNames.length === 0 && !state.isLoading && (
          <div className="py-16 text-center text-text-secondary">
            <p className="text-[15px]">尚無班會，點右下角 + 新增</p>
          </div>
        )}
        {state.sheetNames.map((name) => (
          <MeetingCard
            key={name}
            name={name}
            isOpen={swipedOpen === name}
            onOpen={() => openMeeting(name)}
            onEdit={() => {
              setEditTarget(name)
              setSwipedOpen(null)
            }}
            onDelete={() => {
              setDeleteTarget(name)
              setSwipedOpen(null)
            }}
            onSwipeOpen={() => setSwipedOpen(name)}
            onSwipeClose={() => setSwipedOpen(null)}
          />
        ))}
      </div>

      <Fab onClick={() => setShowAdd(true)} />

      <AddMeetingDialog
        open={showAdd}
        onOpenChange={setShowAdd}
        onAdd={handleAdd}
      />

      <EditMeetingDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        currentName={editTarget || ''}
        onSave={handleEdit}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="刪除班會"
        description={`確定要刪除「${deleteTarget}」嗎？此操作無法復原。`}
        onConfirm={handleDelete}
      />
    </>
  )
}
