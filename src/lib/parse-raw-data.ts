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
    if (val) dates.push({ col: c, label: val })
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
    dates.forEach((d) => {
      const val = (row[d.col] || '').trim()
      attendance[d.label] = val
    })

    members.push({ row: r + 1, name, group, attendance })
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

export function formatDateLabel(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const days = ['日', '一', '二', '三', '四', '五', '六']
  const day = days[date.getDay()]
  return `${mm}/${dd}(${day})`
}
