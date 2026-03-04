'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface LockScreenProps {
  onUnlock: (password: string) => boolean
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    if (password.length !== 8) {
      setError('請輸入 8 位數密碼')
      setShaking(true)
      setTimeout(() => setShaking(false), 300)
      return
    }
    const ok = onUnlock(password)
    if (!ok) {
      setError('密碼錯誤')
      setShaking(true)
      setTimeout(() => setShaking(false), 300)
      setPassword('')
      inputRef.current?.focus()
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#E8F0E4] via-[#F5F3EB] to-[#E4EBE0]">
      {/* Nature decorative elements */}
      <div className="pointer-events-none absolute -bottom-[5%] -left-[10%] h-[40%] w-[120%] bg-[radial-gradient(ellipse_at_20%_100%,rgba(74,158,111,0.08)_0%,transparent_60%),radial-gradient(ellipse_at_70%_100%,rgba(107,191,138,0.06)_0%,transparent_50%)]" />
      <div className="pointer-events-none absolute right-[-5%] top-[5%] h-[200px] w-[200px] bg-[radial-gradient(circle,rgba(212,162,78,0.06)_0%,transparent_70%)]" />

      <div className={`relative z-10 w-full max-w-[340px] px-8 text-center ${shaking ? 'animate-shake' : ''}`}>
        {/* Icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[1.5px] border-white/50 bg-white/70 shadow-[0_4px_20px_rgba(74,158,111,0.1)] backdrop-blur-xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A9E6F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>
        </div>

        <h1 className="mb-1 text-[26px] font-extrabold tracking-tight text-primary-dark">
          LaiClass
        </h1>
        <p className="mb-7 text-sm text-text-secondary">請輸入密碼</p>

        <Input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          maxLength={8}
          placeholder="8 位 數 密 碼"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="bg-white/65 text-center text-2xl tracking-[8px] rounded-[14px] backdrop-blur-lg"
        />

        {error && (
          <p className="mt-2 text-sm font-medium text-danger">{error}</p>
        )}

        <Button
          variant="accent"
          onClick={handleSubmit}
          className="mt-5 w-full rounded-[14px] py-4 text-base font-bold tracking-wider shadow-[0_4px_16px_rgba(224,135,92,0.35)]"
        >
          進入
        </Button>
      </div>
    </div>
  )
}
