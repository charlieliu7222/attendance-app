import type { ParsedData, DateInfo, MemberInfo } from '@/types'

export function parseRawData(data: string[][]): ParsedData {
  let dateRow = -1
  let dateCol = -1

  // Find the "日期" header cell
  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[r].length; c++) {
      if (data[r][c].trim() === '日期') {
        dateRow = r
        dateCol = c
        break
      }
    }
    if (dateRow >= 0) break
  }

  if (dateRow < 0) {
    return { dateRow: -1, dateCol: -1, dates: [], members: [] }
  }

  // Extract dates from columns after "日期"
  const dates: DateInfo[] = []
  for (let c = dateCol + 1; c < data[dateRow].length; c++) {
    const val = data[dateRow][c].trim()
    if (!val || val === '帶便當') continue
    dates.push({ col: c, label: val })
  }

  // 偵測「帶便當」欄位：檢查日期欄的下一欄是否為「帶便當」
  for (let i = 0; i < dates.length; i++) {
    const nextCol = dates[i].col + 1
    // 確保 nextCol 不是另一個日期欄
    const isNextDate = dates.some((d) => d.col === nextCol)
    if (!isNextDate && nextCol < data[dateRow].length) {
      const headerVal = (data[dateRow][nextCol] || '').trim()
      if (headerVal === '帶便當') {
        dates[i].lunchCol = nextCol
      }
    }
  }

  // Extract members from rows after "日期"
  const nameCol = dateCol + 1
  const members: MemberInfo[] = []
  const skipWords = ['人數', '備註', '日期']
  let lastGroup = ''

  for (let r = dateRow + 1; r < data.length; r++) {
    const row = data[r]
    const fullRow = row.join('')
    if (fullRow.indexOf('備註') >= 0) continue

    const name = (row[nameCol] || '').trim()
    const groupVal = (row[dateCol] || '').trim()

    if (groupVal && !skipWords.includes(groupVal) && groupVal !== '人數') {
      lastGroup = groupVal
    }
    const group = lastGroup

    if (!name || skipWords.includes(name)) {
      if ((row[dateCol] || '').trim() === '人數') continue
      continue
    }

    const attendance: Record<string, string> = {}
    const lunch: Record<string, string> = {}

    dates.forEach((d) => {
      const val = (row[d.col] || '').trim()
      attendance[d.label] = val

      // 解析帶便當欄位
      if (d.lunchCol !== undefined) {
        const lunchVal = (row[d.lunchCol] || '').trim()
        lunch[d.label] = lunchVal
      }
    })

    members.push({ row: r + 1, name, group, attendance, lunch })
  }

  return { dateRow: dateRow + 1, dateCol, dates, members }
}

export function getAttendanceStatus(
  value: string
): 'present' | 'late' | 'absent' | 'none' {
  if (!value) return 'none'
  const v = value.trim()
  if (v === 'v' || v === 'V' || v === '✓' || v === '出席') return 'present'
  if (v === '△' || v === 'Δ' || v === '遲到') return 'late'
  if (v) return 'absent'
  return 'none'
}

export function getLunchStatus(value: string): boolean {
  if (!value) return false
  const v = value.trim().toLowerCase()
  return v === 'v' || v === '是' || v === '✓' || v === '1'
}

export function formatDateLabel(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const days = ['日', '一', '二', '三', '四', '五', '六']
  const day = days[date.getDay()]
  return `${mm}/${dd}(${day})`
}
