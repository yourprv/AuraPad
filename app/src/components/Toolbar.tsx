import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FilePlus,
  FolderOpen,
  Save,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Search,
  Settings,
  Type,
  Sun,
  Moon,
  Maximize,
  Minimize,
  WrapText,
  ListOrdered,
  Keyboard,
} from 'lucide-react'

interface ToolbarProps {
  onNew: () => void
  onOpen: () => void
  onSave: () => void
  onToggleBold: () => void
  onToggleItalic: () => void
  onToggleUnderline?: () => void
  onToggleStrikethrough: () => void
  onFind: () => void
  onToggleTheme: () => void
  onToggleFullscreen: () => void
  onToggleLineNumbers: () => void
  onToggleWordWrap: () => void
  onShowShortcuts: () => void
  onShowSettings: () => void
  onFontSizeChange: (size: number) => void
  isBoldActive: boolean
  isItalicActive: boolean
  isUnderlineActive: boolean
  isStrikethroughActive: boolean
  theme: 'light' | 'dark'
  isFullscreen: boolean
  showLineNumbers: boolean
  wordWrap: boolean
  wordCount: number
  charCount: number
  readingTime: number
  hasUnsavedChanges: boolean
  fontSize: number
}

interface TooltipButtonProps {
  children: React.ReactNode
  tooltip: string
  onClick: () => void
  active?: boolean
  shortcut?: string
}

function TooltipButton({ children, tooltip, onClick, active, shortcut }: TooltipButtonProps) {
  const [show, setShow] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setShow(true), 300)
  }
  const handleLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setShow(false)
  }

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        className={`relative p-2 rounded-md transition-all duration-200 group ${
          active
            ? 'bg-[#fabe00]/25 text-[#fabe00] shadow-[0_0_0.35rem_rgba(251,190,0,0.22)]'
            : 'hover:bg-white/10 text-white/70 hover:text-white'
        }`}
      >
        {children}
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1a1a1a] text-white text-xs rounded-md whitespace-nowrap z-[100] shadow-xl border border-white/10"
            >
              <div className="font-medium">{tooltip}</div>
              {shortcut && (
                <div className="text-white/50 text-[10px] mt-0.5">{shortcut}</div>
              )}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                <div className="w-2 h-2 bg-[#1a1a1a] rotate-45 border-r border-b border-white/10" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}

export default function Toolbar({
  onNew,
  onOpen,
  onSave,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
  onToggleStrikethrough,
  onFind,
  onToggleTheme,
  onToggleFullscreen,
  onToggleLineNumbers,
  onToggleWordWrap,
  onShowShortcuts,
  onShowSettings,
  onFontSizeChange,
  isBoldActive,
  isItalicActive,
  isUnderlineActive,
  isStrikethroughActive,
  theme,
  isFullscreen,
  showLineNumbers,
  wordWrap,
  wordCount,
  charCount,
  readingTime,
  hasUnsavedChanges,
  fontSize,
}: ToolbarProps) {
  const [showFontMenu, setShowFontMenu] = useState(false)
  const fontMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (fontMenuRef.current && !fontMenuRef.current.contains(e.target as Node)) {
        setShowFontMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5"
    >
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left Group */}
        <div className="flex items-center gap-1">
          <TooltipButton tooltip="New Note" shortcut="Ctrl+N" onClick={onNew}>
            <FilePlus size={16} />
          </TooltipButton>
          <TooltipButton tooltip="Open File" shortcut="Ctrl+O" onClick={onOpen}>
            <FolderOpen size={16} />
          </TooltipButton>
          <TooltipButton tooltip="Save" shortcut="Ctrl+S" onClick={onSave}>
            <Save size={16} />
          </TooltipButton>

          <div className="w-px h-5 bg-white/10 mx-2" />

          <TooltipButton tooltip="Bold" shortcut="Ctrl+B" onClick={onToggleBold} active={isBoldActive}>
            <Bold size={16} />
          </TooltipButton>
          <TooltipButton tooltip="Italic" shortcut="Ctrl+I" onClick={onToggleItalic} active={isItalicActive}>
            <Italic size={16} />
          </TooltipButton>
          {onToggleUnderline && (
            <TooltipButton tooltip="Underline" shortcut="Ctrl+U" onClick={onToggleUnderline} active={isUnderlineActive}>
              <Underline size={16} />
            </TooltipButton>
          )}
          <TooltipButton tooltip="Strikethrough" onClick={onToggleStrikethrough} active={isStrikethroughActive}>
            <Strikethrough size={16} />
          </TooltipButton>
        </div>

        {/* Center Group - Font Controls */}
        <div className="flex items-center gap-1" ref={fontMenuRef}>
          <div className="relative">
            <button
              onClick={() => setShowFontMenu(!showFontMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 text-xs"
            >
              <Type size={14} />
              <span className="font-medium">{fontSize}px</span>
            </button>
            <AnimatePresence>
              {showFontMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 py-2 bg-[#1a1a1a] rounded-lg shadow-2xl border border-white/10 z-[100] min-w-[160px]"
                >
                  <div className="px-3 py-1.5 text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                    Font Size
                  </div>
                  {[12, 14, 16, 18, 20, 22, 24, 28, 32].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        onFontSizeChange(size)
                        setShowFontMenu(false)
                      }}
                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                        fontSize === size
                          ? 'text-[#fabe00] bg-[#fabe00]/10'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <TooltipButton
            tooltip="Toggle Line Numbers"
            onClick={onToggleLineNumbers}
            active={showLineNumbers}
          >
            <ListOrdered size={16} />
          </TooltipButton>
          <TooltipButton
            tooltip="Toggle Word Wrap"
            onClick={onToggleWordWrap}
            active={wordWrap}
          >
            <WrapText size={16} />
          </TooltipButton>
        </div>

        {/* Right Group */}
        <div className="flex items-center gap-1">
          <TooltipButton tooltip="Find & Replace" shortcut="Ctrl+F" onClick={onFind}>
            <Search size={16} />
          </TooltipButton>
          <TooltipButton tooltip="Keyboard Shortcuts" onClick={onShowShortcuts}>
            <Keyboard size={16} />
          </TooltipButton>
          <TooltipButton tooltip="Settings" onClick={onShowSettings}>
            <Settings size={16} />
          </TooltipButton>
          <TooltipButton
            tooltip={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            shortcut="Ctrl+Shift+L"
            onClick={onToggleTheme}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </TooltipButton>
          <TooltipButton
            tooltip={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            shortcut="F11"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </TooltipButton>

          <div className="w-px h-5 bg-white/10 mx-2" />

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-white/50">
            {hasUnsavedChanges && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#fabe00] pulse-unsaved" />
                <span className="text-[#fabe00]/70">Unsaved</span>
              </motion.span>
            )}
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
            <span>{readingTime} min read</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
