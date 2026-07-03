import { useEffect } from 'react'

interface ShortcutHandlers {
  onSave: () => void
  onNew: () => void
  onOpen: () => void
  onFind: () => void
  onToggleTheme: () => void
  onToggleFullscreen: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey

      if (isCtrl && e.key === 's') {
        e.preventDefault()
        handlers.onSave()
      } else if (isCtrl && e.key === 'n') {
        e.preventDefault()
        handlers.onNew()
      } else if (isCtrl && e.key === 'o') {
        e.preventDefault()
        handlers.onOpen()
      } else if (isCtrl && e.key === 'f') {
        e.preventDefault()
        handlers.onFind()
      } else if (isCtrl && e.shiftKey && e.key === 'L') {
        e.preventDefault()
        handlers.onToggleTheme()
      } else if (e.key === 'F11') {
        e.preventDefault()
        handlers.onToggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}
