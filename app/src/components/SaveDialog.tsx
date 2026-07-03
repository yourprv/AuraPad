import { motion, AnimatePresence } from 'framer-motion'
import { FileText, FileCode, X } from 'lucide-react'

interface SaveDialogProps {
  isOpen: boolean
  onClose: () => void
  fileName: string
  onFileNameChange: (name: string) => void
  onSaveTxt: () => void
  onSaveDocx: () => void
  onSavePdf: () => void
  onSaveMd: () => void
}

export default function SaveDialog({
  isOpen,
  onClose,
  fileName,
  onFileNameChange,
  onSaveTxt,
  onSaveDocx,
  onSavePdf,
  onSaveMd,
}: SaveDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Save Document</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-4">
              <label className="text-sm text-white/50 block mb-2" htmlFor="save-file-name">
                File name
              </label>
              <input
                id="save-file-name"
                value={fileName}
                onChange={(e) => onFileNameChange(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-white outline-none focus:border-[#fabe00]/80"
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={onSaveTxt}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-blue-400" />
                  <div>
                    <p className="font-medium text-white">Save as .txt</p>
                    <p className="text-xs text-white/50">Plain text format</p>
                  </div>
                </div>
              </button>

              <button
                onClick={onSaveDocx}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <FileCode size={18} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-white">Save as .docx</p>
                    <p className="text-xs text-white/50">Microsoft Word format</p>
                  </div>
                </div>
              </button>

              <button
                onClick={onSavePdf}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-red-400" />
                  <div>
                    <p className="font-medium text-white">Save as .pdf</p>
                    <p className="text-xs text-white/50">PDF document</p>
                  </div>
                </div>
              </button>

              <button
                onClick={onSaveMd}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <FileCode size={18} className="text-green-400" />
                  <div>
                    <p className="font-medium text-white">Save as .md</p>
                    <p className="text-xs text-white/50">Markdown format</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-white/10 px-4 py-2 font-medium text-white/70 transition hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
