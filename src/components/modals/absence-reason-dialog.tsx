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

interface AbsenceReasonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberName: string
  currentReason: string
  onSave: (reason: string) => Promise<void>
}

export function AbsenceReasonDialog({
  open,
  onOpenChange,
  memberName,
  currentReason,
  onSave,
}: AbsenceReasonDialogProps) {
  const [reason, setReason] = useState(currentReason)

  useEffect(() => {
    if (open) setReason(currentReason)
  }, [open, currentReason])

  const handleConfirm = async () => {
    await onSave(reason.trim() || '缺席')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{memberName} - 缺席原因</DialogTitle>
        <DialogDescription className="sr-only">輸入缺席原因</DialogDescription>
        <Input
          placeholder="請輸入原因（可留空）"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          autoFocus
        />
        <div className="mt-4 flex gap-2.5">
          <Button variant="cancel" className="flex-1" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleConfirm}>
            確認缺席
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
