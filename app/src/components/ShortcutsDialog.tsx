import { motion, AnimatePresence } from 'framer-motion'
import { X, Keyboard } from 'lucide-react'

interface ShortcutsDialogProps {
  isOpen: boolean
  onClose: () => void
  theme: 'light' | 'dark'
}

const shortcuts = [
  { keys: ['Ctrl', 'N'], description: 'New note' },
  { keys: ['Ctrl', 'O'], description: 'Open file' },
  { keys: ['Ctrl', 'S'], description: 'Save as .txt' },
  { keys: ['Ctrl', 'F'], description: 'Find & Replace' },
  { keys: ['Ctrl', 'Shift', 'L'], description: 'Toggle theme' },
  { keys: ['F11'], description: 'Toggle fullscreen' },
  { keys: ['Ctrl', 'B'], description: 'Bold' },
  { keys: ['Ctrl', 'I'], description: 'Italic' },
  { keys: ['Tab'], description: 'Insert spaces' },
]

export default function ShortcutsDialog({ isOpen, onClose, theme }: ShortcutsDialogProps) {
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
            className={`w-full max-w-md mx-4 rounded-2xl shadow-2xl border overflow-hidden ${
              isDark
                ? 'bg-[#1a1a1a] border-white/10'
                : 'bg-white border-black/5'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#fabe00]/10">
                  <Keyboard size={18} className="text-[#fabe00]" />
                </div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Keyboard Shortcuts
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

            <div className="p-5">
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <motion.div
                    key={shortcut.description}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between py-2 ${
                      index < shortcuts.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    <span className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={key} className="flex items-center gap-1">
                          <kbd
                            className={`px-2 py-1 rounded text-xs font-mono font-medium ${
                              isDark
                                ? 'bg-white/10 text-white/80 border border-white/10'
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                          >
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className={isDark ? 'text-white/30' : 'text-gray-300'}>+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
