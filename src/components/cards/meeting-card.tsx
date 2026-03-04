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

const ACTION_WIDTH = 88 // 兩個 icon 按鈕 + 間距
const THRESHOLD = 40 // 滑動超過此距離才吸附開啟

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

  // Icons: 從右側滑入，ACTION_WIDTH（隱藏）→ 0（顯示）
  const iconsTranslateX = ACTION_WIDTH + displayOffset

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* 主卡片 — 固定不動 */}
      <Card
        className="relative flex cursor-pointer items-center justify-between px-[18px] py-4 active:shadow-[0_1px_4px_rgba(44,62,45,0.05)]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        <span className="text-base font-semibold text-text">{name}</span>
        <ChevronRight size={18} className="text-text-secondary opacity-50 flex-shrink-0" />
      </Card>

      {/* 操作 icon — 從右側滑入覆蓋 */}
      <div
        className="absolute right-0 top-0 bottom-0 z-10 flex items-center gap-1 bg-white pr-3 pl-2"
        style={{
          transform: `translateX(${iconsTranslateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isOpen || (isDragging && offsetX < -THRESHOLD) ? 'auto' : 'none',
          boxShadow: iconsTranslateX < ACTION_WIDTH ? '-2px 0 8px rgba(0,0,0,0.05)' : 'none',
        }}
      >
        <button
          onClick={onEdit}
          className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary opacity-60 transition-all active:bg-primary-glow active:text-primary-dark active:opacity-100"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary opacity-60 transition-all active:bg-[rgba(199,91,91,0.1)] active:text-[#8B2E2E] active:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
