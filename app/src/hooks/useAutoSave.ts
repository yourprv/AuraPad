import { useEffect, useRef, useCallback } from 'react'

const STORAGE_KEY = 'aurapad-content'
const SETTINGS_KEY = 'aurapad-settings'

interface SavedSettings {
  theme: 'light' | 'dark'
  fontFamily: string
  fontSize: number
  lineHeight: number
  showLineNumbers: boolean
  wordWrap: boolean
}

export function useAutoSave(
  content: string,
  onRestore: (content: string) => void
) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, content)
    }, 2000)
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [content])

  const restoreContent = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      onRestore(saved)
    }
  }, [onRestore])

  const clearSaved = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { restoreContent, clearSaved }
}

export function saveSettings(settings: SavedSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadSettings(): SavedSettings | null {
  const saved = localStorage.getItem(SETTINGS_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return null
    }
  }
  return null
}
