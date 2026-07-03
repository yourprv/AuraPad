import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings, Type, AlignLeft, Palette, Monitor } from 'lucide-react'

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  theme: 'light' | 'dark'
  fontFamily: string
  fontSize: number
  lineHeight: number
  showLineNumbers: boolean
  wordWrap: boolean
  onThemeChange: (theme: 'light' | 'dark') => void
  onFontFamilyChange: (family: string) => void
  onFontSizeChange: (size: number) => void
  onLineHeightChange: (height: number) => void
  onToggleLineNumbers: () => void
  onToggleWordWrap: () => void
}

const fontFamilies = [
  { value: 'sans', label: 'Sans Serif', desc: 'Clean and modern', preview: 'Noto Sans' },
  { value: 'serif', label: 'Serif', desc: 'Classic and elegant', preview: 'Noto Serif' },
  { value: 'mono', label: 'Monospace', desc: 'Code and technical', preview: 'Fira Code' },
]

const lineHeightOptions = [
  { value: 1.4, label: 'Compact' },
  { value: 1.6, label: 'Normal' },
  { value: 1.8, label: 'Relaxed' },
  { value: 2.0, label: 'Wide' },
  { value: 2.4, label: 'Extra Wide' },
]

export default function SettingsDialog({
  isOpen,
  onClose,
  theme,
  fontFamily,
  fontSize,
  lineHeight,
  showLineNumbers,
  wordWrap,
  onThemeChange,
  onFontFamilyChange,
  onFontSizeChange,
  onLineHeightChange,
  onToggleLineNumbers,
  onToggleWordWrap,
}: SettingsDialogProps) {
  const isDark = theme === 'dark'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`w-full max-w-lg mx-4 rounded-2xl shadow-2xl border overflow-hidden ${
              isDark
                ? 'bg-[#1a1a1a] border-white/10'
                : 'bg-white border-black/5'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#fabe00]/10">
                  <Settings size={18} className="text-[#fabe00]" />
                </div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Settings
                </h2>
              </div>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-black/5 text-gray-400'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Theme */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette size={14} className={isDark ? 'text-white/40' : 'text-gray-400'} />
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    Theme
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['light', 'dark'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => onThemeChange(t)}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        theme === t
                          ? 'border-[#fabe00] bg-[#fabe00]/5'
                          : isDark
                          ? 'border-white/5 hover:border-white/10 bg-white/5'
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          t === 'light' ? 'bg-[#fdfde7]' : 'bg-[#1a1a1a] border border-white/10'
                        }`}
                      >
                        {t === 'light' ? (
                          <Monitor size={14} className="text-amber-600" />
                        ) : (
                          <Monitor size={14} className="text-amber-400" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {t === 'light' ? 'Light' : 'Dark'}
                        </div>
                      </div>
                      {theme === t && (
                        <motion.div
                          layoutId="theme-indicator"
                          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#fabe00]"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Type size={14} className={isDark ? 'text-white/40' : 'text-gray-400'} />
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    Font Family
                  </h3>
                </div>
                <div className="space-y-2">
                  {fontFamilies.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => onFontFamilyChange(font.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                        fontFamily === font.value
                          ? 'border-[#fabe00] bg-[#fabe00]/5'
                          : isDark
                          ? 'border-white/5 hover:border-white/10 bg-white/5'
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div
                        className={`text-lg font-medium w-8 text-center ${
                          isDark ? 'text-white/60' : 'text-gray-500'
                        }`}
                        style={{
                          fontFamily:
                            font.value === 'serif'
                              ? "'Noto Serif JP', serif"
                              : font.value === 'mono'
                              ? "'Fira Code', monospace"
                              : "'Noto Sans JP', sans-serif",
                        }}
                      >
                        Aa
                      </div>
                      <div className="text-left">
                        <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {font.label}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                          {font.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlignLeft size={14} className={isDark ? 'text-white/40' : 'text-gray-400'} />
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      Font Size
                    </h3>
                  </div>
                  <span className={`text-sm font-mono ${isDark ? 'text-[#fabe00]' : 'text-amber-600'}`}>
                    {fontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={32}
                  step={1}
                  value={fontSize}
                  onChange={(e) => onFontSizeChange(Number(e.target.value))}
                  className="w-full accent-[#fabe00]"
                />
                <div className={`flex justify-between text-xs mt-1 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                  <span>12px</span>
                  <span>32px</span>
                </div>
              </div>

              {/* Line Height */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlignLeft size={14} className={isDark ? 'text-white/40' : 'text-gray-400'} />
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      Line Height
                    </h3>
                  </div>
                  <span className={`text-sm font-mono ${isDark ? 'text-[#fabe00]' : 'text-amber-600'}`}>
                    {lineHeight}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {lineHeightOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onLineHeightChange(option.value)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        lineHeight === option.value
                          ? 'bg-[#fabe00] text-black'
                          : isDark
                          ? 'bg-white/5 text-white/60 hover:bg-white/10'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div>
                <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Editor Options
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={onToggleLineNumbers}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                      showLineNumbers
                        ? 'border-[#fabe00]/50 bg-[#fabe00]/5'
                        : isDark
                        ? 'border-white/5 bg-white/5'
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Show Line Numbers
                    </span>
                    <div
                      className={`w-10 h-6 rounded-full transition-all ${
                        showLineNumbers ? 'bg-[#fabe00]' : isDark ? 'bg-white/20' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        animate={{ x: showLineNumbers ? 16 : 2 }}
                        className="w-5 h-5 rounded-full bg-white shadow-md mt-0.5"
                      />
                    </div>
                  </button>

                  <button
                    onClick={onToggleWordWrap}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                      wordWrap
                        ? 'border-[#fabe00]/50 bg-[#fabe00]/5'
                        : isDark
                        ? 'border-white/5 bg-white/5'
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Word Wrap
                    </span>
                    <div
                      className={`w-10 h-6 rounded-full transition-all ${
                        wordWrap ? 'bg-[#fabe00]' : isDark ? 'bg-white/20' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        animate={{ x: wordWrap ? 16 : 2 }}
                        className="w-5 h-5 rounded-full bg-white shadow-md mt-0.5"
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
