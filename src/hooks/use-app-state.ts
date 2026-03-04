'use client'

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
  type Dispatch,
} from 'react'
import React from 'react'
import type { PageType, ParsedData } from '@/types'
import { api } from '@/lib/api'
import { saveCache, loadCache } from '@/lib/cache'
import { parseRawData } from '@/lib/parse-raw-data'

// ---- State ----
interface AppState {
  currentPage: PageType
  sheetNames: string[]
  currentSheet: string | null
  rawData: string[][] | null
  parsedData: ParsedData | null
  currentDateIndex: number | null
  selectedTagDateIndex: number | null
  isLoading: boolean
  headerTitle: string
}

const initialState: AppState = {
  currentPage: 'meetings',
  sheetNames: [],
  currentSheet: null,
  rawData: null,
  parsedData: null,
  currentDateIndex: null,
  selectedTagDateIndex: null,
  isLoading: false,
  headerTitle: 'LaiClass',
}

// ---- Actions ----
type AppAction =
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_SHEETS'; sheets: string[] }
  | { type: 'OPEN_MEETING'; sheet: string; rawData: string[][]; parsed: ParsedData }
  | { type: 'SELECT_DATE'; index: number | null }
  | { type: 'OPEN_DATE'; index: number }
  | { type: 'GO_BACK' }
  | { type: 'REFRESH_DATA'; rawData: string[][]; parsed: ParsedData }
  | { type: 'UPDATE_MEMBER_ATTENDANCE'; memberIndex: number; dateLabel: string; value: string }

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading }

    case 'SET_SHEETS':
      return { ...state, sheetNames: action.sheets }

    case 'OPEN_MEETING':
      return {
        ...state,
        currentPage: 'sessions',
        currentSheet: action.sheet,
        rawData: action.rawData,
        parsedData: action.parsed,
        headerTitle: action.sheet,
        currentDateIndex: null,
        selectedTagDateIndex: null,
      }

    case 'SELECT_DATE': {
      const idx =
        action.index === state.selectedTagDateIndex ? null : action.index
      return { ...state, selectedTagDateIndex: idx }
    }

    case 'OPEN_DATE':
      return {
        ...state,
        currentPage: 'members',
        currentDateIndex: action.index,
        headerTitle: state.parsedData?.dates[action.index]?.label || '',
      }

    case 'GO_BACK':
      if (state.currentPage === 'members') {
        return {
          ...state,
          currentPage: 'sessions',
          currentDateIndex: null,
          headerTitle: state.currentSheet || 'LaiClass',
        }
      }
      if (state.currentPage === 'sessions') {
        return {
          ...state,
          currentPage: 'meetings',
          currentSheet: null,
          rawData: null,
          parsedData: null,
          headerTitle: 'LaiClass',
          selectedTagDateIndex: null,
        }
      }
      return state

    case 'REFRESH_DATA':
      return {
        ...state,
        rawData: action.rawData,
        parsedData: action.parsed,
      }

    case 'UPDATE_MEMBER_ATTENDANCE': {
      if (!state.parsedData) return state
      const newMembers = state.parsedData.members.map((m, i) => {
        if (i !== action.memberIndex) return m
        return {
          ...m,
          attendance: {
            ...m.attendance,
            [action.dateLabel]: action.value,
          },
        }
      })
      return {
        ...state,
        parsedData: { ...state.parsedData, members: newMembers },
      }
    }

    default:
      return state
  }
}

// ---- Context ----
interface AppContextType {
  state: AppState
  dispatch: Dispatch<AppAction>
  loadMeetings: () => Promise<void>
  openMeeting: (name: string) => Promise<void>
  refreshCurrentSheet: () => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const loadMeetings = useCallback(async () => {
    // Cache-first
    const cached = loadCache<string[]>('sheets')
    if (cached) {
      dispatch({ type: 'SET_SHEETS', sheets: cached })
      // Silent background refresh
      const res = await api.getSheetsSilent()
      if (res?.sheets) {
        dispatch({ type: 'SET_SHEETS', sheets: res.sheets })
        saveCache('sheets', res.sheets)
      }
      return
    }

    dispatch({ type: 'SET_LOADING', loading: true })
    const res = await api.getSheets()
    dispatch({ type: 'SET_LOADING', loading: false })
    if (res?.sheets) {
      dispatch({ type: 'SET_SHEETS', sheets: res.sheets })
      saveCache('sheets', res.sheets)
    }
  }, [])

  const openMeeting = useCallback(async (name: string) => {
    // Cache-first
    const cached = loadCache<string[][]>(`raw_${name}`)
    if (cached) {
      const parsed = parseRawData(cached)
      dispatch({ type: 'OPEN_MEETING', sheet: name, rawData: cached, parsed })
      // Silent background refresh
      const res = await api.getRawSilent(name)
      if (res?.data) {
        const freshParsed = parseRawData(res.data)
        dispatch({ type: 'REFRESH_DATA', rawData: res.data, parsed: freshParsed })
        saveCache(`raw_${name}`, res.data)
      }
      return
    }

    dispatch({ type: 'SET_LOADING', loading: true })
    const res = await api.getRaw(name)
    dispatch({ type: 'SET_LOADING', loading: false })
    if (res?.data) {
      const parsed = parseRawData(res.data)
      dispatch({ type: 'OPEN_MEETING', sheet: name, rawData: res.data, parsed })
      saveCache(`raw_${name}`, res.data)
    }
  }, [])

  const refreshCurrentSheet = useCallback(async () => {
    if (!state.currentSheet) return
    dispatch({ type: 'SET_LOADING', loading: true })
    const res = await api.getRaw(state.currentSheet)
    dispatch({ type: 'SET_LOADING', loading: false })
    if (res?.data) {
      const parsed = parseRawData(res.data)
      dispatch({ type: 'REFRESH_DATA', rawData: res.data, parsed })
      saveCache(`raw_${state.currentSheet}`, res.data)
    }
  }, [state.currentSheet])

  return React.createElement(
    AppContext.Provider,
    { value: { state, dispatch, loadMeetings, openMeeting, refreshCurrentSheet } },
    children
  )
}

export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
