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

interface EditDateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentLabel: string
  onSave: (newLabel: string) => Promise<void>
}

export function EditDateDialog({
  open,
  onOpenChange,
  currentLabel,
  onSave,
}: EditDateDialogProps) {
  const [label, setLabel] = useState(currentLabel)

  useEffect(() => {
    if (open) setLabel(currentLabel)
  }, [open, currentLabel])

  const handleConfirm = async () => {
    const trimmed = label.trim()
    if (!trimmed) return
    await onSave(trimmed)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>編輯日期</DialogTitle>
        <DialogDescription className="sr-only">修改日期標籤</DialogDescription>
        <Input
          placeholder="日期標籤"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
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
