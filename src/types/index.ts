export interface DateInfo {
  col: number
  label: string
  lunchCol?: number // 帶便當欄位的 column index
}

export interface MemberInfo {
  row: number
  name: string
  group: string
  attendance: Record<string, string>
  lunch: Record<string, string> // 帶便當狀態 (per date)
}

export interface ParsedData {
  dateRow: number
  dateCol: number
  dates: DateInfo[]
  members: MemberInfo[]
}

export interface ApiResponse<T = unknown> {
  success: boolean
  error?: string
  data?: T
  sheets?: string[]
}

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'none'

export type PageType = 'meetings' | 'sessions' | 'members'
