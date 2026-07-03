import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ChevronUp, Replace, ReplaceAll, Search } from 'lucide-react'

interface FindReplaceProps {
  isOpen: boolean
  onClose: () => void
  editorRef: React.RefObject<{ getSelectedText: () => string; replaceText: (find: string, replace: string, all?: boolean) => number } | null>
  theme: 'light' | 'dark'
}

export default function FindReplace({ isOpen, onClose, editorRef, theme }: FindReplaceProps) {
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [showReplace, setShowReplace] = useState(true)
  const [matchCount, setMatchCount] = useState(0)
  const findInputRef = useRef<HTMLInputElement>(null)
  const isDark = theme === 'dark'

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => findInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const countMatches = (text: string) => {
    if (!text || !editorRef.current) return 0
    const content = document.querySelector('[contenteditable]')?.textContent || ''
    const regex = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    return (content.match(regex) || []).length
  }

  const handleFindChange = (value: string) => {
    setFindText(value)
    setMatchCount(countMatches(value))
  }

  const handleReplace = () => {
    if (editorRef.current && findText) {
      editorRef.current.replaceText(findText, replaceText, false)
      setMatchCount(countMatches(findText))
    }
  }

  const handleReplaceAll = () => {
    if (editorRef.current && findText) {
      editorRef.current.replaceText(findText, replaceText, true)
      setMatchCount(0)
      setFindText('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`absolute top-14 right-4 z-[100] w-80 rounded-xl shadow-2xl border ${
            isDark
              ? 'bg-[#1a1a1a] border-white/10'
              : 'bg-white border-black/5'
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Find & Replace
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowReplace(!showReplace)}
                  className={`p-1 rounded transition-colors ${
                    isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-black/5 text-gray-400'
                  }`}
                >
                  {showReplace ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button
                  onClick={onClose}
                  className={`p-1 rounded transition-colors ${
                    isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-black/5 text-gray-400'
                  }`}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-gray-400'}`} />
                <input
                  ref={findInputRef}
                  type="text"
                  value={findText}
                  onChange={(e) => handleFindChange(e.target.value)}
                  placeholder="Find..."
                  className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-colors ${
                    isDark
                      ? 'bg-white/5 text-white placeholder:text-white/30 focus:bg-white/10 border border-white/5 focus:border-[#fabe00]/50'
                      : 'bg-black/5 text-gray-800 placeholder:text-gray-400 focus:bg-black/10 border border-transparent focus:border-[#fabe00]/50'
                  }`}
                />
                {findText && (
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                    {matchCount} matches
                  </span>
                )}
              </div>

              <AnimatePresence>
                {showReplace && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="text"
                      value={replaceText}
                      onChange={(e) => setReplaceText(e.target.value)}
                      placeholder="Replace with..."
                      className={`w-full px-4 py-2 rounded-lg text-sm outline-none transition-colors ${
                        isDark
                          ? 'bg-white/5 text-white placeholder:text-white/30 focus:bg-white/10 border border-white/5 focus:border-[#fabe00]/50'
                          : 'bg-black/5 text-gray-800 placeholder:text-gray-400 focus:bg-black/10 border border-transparent focus:border-[#fabe00]/50'
                      }`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {showReplace && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleReplace}
                    disabled={!findText}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      findText
                        ? 'bg-[#fabe00] text-black hover:bg-[#e0a800]'
                        : 'opacity-30 cursor-not-allowed bg-[#fabe00] text-black'
                    }`}
                  >
                    <Replace size={12} />
                    Replace
                  </button>
                  <button
                    onClick={handleReplaceAll}
                    disabled={!findText}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      findText
                        ? 'bg-[#fabe00]/20 text-[#fabe00] hover:bg-[#fabe00]/30 border border-[#fabe00]/30'
                        : 'opacity-30 cursor-not-allowed bg-[#fabe00]/20 text-[#fabe00] border border-[#fabe00]/30'
                    }`}
                  >
                    <ReplaceAll size={12} />
                    Replace All
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
