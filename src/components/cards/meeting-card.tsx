'use client'

import { useRef, useState, useCallback } from 'react'
import { Pencil, Trash2, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface MeetingCardProps {
  name: string
  isOpen: boolean
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
  onSwipeOpen: () => void
  onSwipeClose: () => void
}

const ACTION_WIDTH = 120 // 兩個按鈕的總寬度
const THRESHOLD = 50 // 滑動超過此距離才吸附開啟

export function MeetingCard({
  name,
  isOpen,
  onOpen,
  onEdit,
  onDelete,
  onSwipeOpen,
  onSwipeClose,
}: MeetingCardProps) {
  const [offsetX, setOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const currentOffset = useRef(0)
  const isHorizontal = useRef<boolean | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    currentOffset.current = isOpen ? -ACTION_WIDTH : 0
    isHorizontal.current = null
    setIsDragging(true)
  }, [isOpen])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return

    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current

    // 判斷滑動方向（只判斷一次）
    if (isHorizontal.current === null) {
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isHorizontal.current = Math.abs(dx) > Math.abs(dy)
      }
      return
    }

    // 如果是垂直滑動，不攔截
    if (!isHorizontal.current) return

    e.preventDefault()

    let newOffset = currentOffset.current + dx
    // 限制範圍：最多左滑 ACTION_WIDTH，不允許右滑超過 0
    newOffset = Math.max(-ACTION_WIDTH - 20, Math.min(0, newOffset))
    setOffsetX(newOffset)
  }, [isDragging])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)

    if (isHorizontal.current === false) return

    // 根據當前偏移量決定吸附到開或關
    if (offsetX < -THRESHOLD) {
      setOffsetX(-ACTION_WIDTH)
      onSwipeOpen()
    } else {
      setOffsetX(0)
      if (isOpen) onSwipeClose()
    }
  }, [offsetX, isOpen, onSwipeOpen, onSwipeClose])

  const handleCardClick = () => {
    if (isOpen) {
      // 如果已展開，點擊先收回
      setOffsetX(0)
      onSwipeClose()
    } else {
      onOpen()
    }
  }

  // 同步外部 isOpen 狀態
  const displayOffset = isDragging ? offsetX : (isOpen ? -ACTION_WIDTH : 0)

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* 底層操作按鈕 */}
      <div className="absolute right-0 top-0 bottom-0 flex">
        <button
          onClick={onEdit}
          className="flex w-[60px] items-center justify-center bg-blue text-white transition-colors active:bg-blue/80"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={onDelete}
          className="flex w-[60px] items-center justify-center bg-danger text-white transition-colors active:bg-danger/80"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* 上層可滑動卡片 */}
      <Card
        className="relative flex cursor-pointer items-center justify-between px-[18px] py-4 active:shadow-[0_1px_4px_rgba(44,62,45,0.05)]"
        style={{
          transform: `translateX(${displayOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        <span className="text-base font-semibold text-text">{name}</span>
        <ChevronRight size={18} className="text-text-secondary opacity-50 flex-shrink-0" />
      </Card>
    </div>
  )
}
