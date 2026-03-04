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

interface AddMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (name: string) => Promise<void>
}

export function AddMeetingDialog({ open, onOpenChange, onAdd }: AddMeetingDialogProps) {
  const [name, setName] = useState('')

  const handleConfirm = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    await onAdd(trimmed)
    setName('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>新增班會</DialogTitle>
        <DialogDescription className="sr-only">輸入新班會名稱</DialogDescription>
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
            確認
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
