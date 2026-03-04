'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatDateLabel } from '@/lib/parse-raw-data'

interface AddSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (dateLabel: string) => Promise<void>
}

export function AddSessionDialog({ open, onOpenChange, onAdd }: AddSessionDialogProps) {
  const today = new Date()
  const defaultVal = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const [dateVal, setDateVal] = useState(defaultVal)

  const handleConfirm = async () => {
    if (!dateVal) return
    const d = new Date(dateVal + 'T00:00:00')
    const label = formatDateLabel(d)
    await onAdd(label)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>新增點名日期</DialogTitle>
        <DialogDescription className="sr-only">選擇日期</DialogDescription>
        <Input
          type="date"
          value={dateVal}
          onChange={(e) => setDateVal(e.target.value)}
        />
        <div className="mt-4 flex gap-2.5">
          <Button variant="cancel" className="flex-1" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button className="flex-1" onClick={handleConfirm}>
            確認
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
