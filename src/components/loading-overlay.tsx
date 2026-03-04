'use client'

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-bg/85 backdrop-blur-lg">
      <div className="h-9 w-9 rounded-full border-[3px] border-primary/15 border-t-primary animate-spin" />
      <p className="mt-3 text-sm text-text-secondary">載入中...</p>
    </div>
  )
}
