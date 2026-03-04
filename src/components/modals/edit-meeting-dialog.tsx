'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface EditMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentName: string
  onSave: (newName: string) => Promise<void>
}

export function EditMeetingDialog({
  open,
  onOpenChange,
  currentName,
  onSave,
}: EditMeetingDialogProps) {
  const [name, setName] = useState(currentName)

  useEffect(() => {
    if (open) setName(currentName)
  }, [open, currentName])

  const handleConfirm = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    await onSave(trimmed)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>編輯班會名稱</DialogTitle>
        <DialogDescription className="sr-only">修改班會名稱</DialogDescription>
        <Input
          placeholder="班會名稱"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          autoFocus
        />
        <div className="mt-4 flex gap-2.5">
          <Button variant="cancel" className="flex-1" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button className="flex-1" onClick={handleConfirm}>
            儲存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
