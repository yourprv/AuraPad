import { motion } from 'framer-motion'
import { ArrowLeft, FilePlus, FolderOpen, Save } from 'lucide-react'
import { useNavigate } from 'react-router'
import Editor from '@/components/Editor'

interface DocxEditorProps {
  content: string
  onChange: (content: string) => void
  theme: 'light' | 'dark'
  fontFamily: string
  fontSize: number
  lineHeight: number
  showLineNumbers: boolean
  wordWrap: boolean
  onOpen: () => void
  onSave: () => void
}

export default function DocxEditor({
  content,
  onChange,
  theme,
  fontFamily,
  fontSize,
  lineHeight,
  showLineNumbers,
  wordWrap,
  onOpen,
  onSave,
}: DocxEditorProps) {
  const navigate = useNavigate()
  const isDark = theme === 'dark'
  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\\s+/g, ' ').trim()
  const wordCount = textContent ? textContent.split(/\\s+/).length : 0
  const charCount = textContent.length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const handleNewDocument = () => {
    window.open('/', '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      {/* Top Bar */}
      <div className={`border-b border-white/10 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f9f9f9]'}`}>
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Back Button and Title */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm transition ${
                isDark ? 'bg-white/5 text-white/70 hover:bg-white/10' : 'bg-black/5 text-black/70 hover:bg-black/10'
              }`}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-black'}`}>DOCX Document</h2>
          </div>

          {/* Right: Stats and Buttons */}
          <div className="flex items-center gap-4">
            {/* Stats Bar */}
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-lg border border-white/10 ${
                isDark ? 'bg-white/5' : 'bg-black/5'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>Words</span>
                <span className={`font-mono font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{wordCount}</span>
              </div>
              <div className={`w-px h-4 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
              <div className="flex items-center gap-1.5">
                <span className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>Chars</span>
                <span className={`font-mono font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{charCount}</span>
              </div>
              <div className={`w-px h-4 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
              <div className="flex items-center gap-1.5">
                <span className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>Read</span>
                <span className={`font-mono font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{readingTime}m</span>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              type="button"
              onClick={handleNewDocument}
              className="inline-flex items-center gap-2 rounded-lg bg-[#fabe00] px-3 py-2 text-sm font-semibold text-black transition hover:bg-[#ffca2a]"
              title="Open new DOCX document"
            >
              <FilePlus size={16} />
              New
            </button>
            <button
              type="button"
              onClick={onOpen}
              className={`inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm transition ${
                isDark ? 'bg-white/5 text-white/70 hover:bg-white/10' : 'bg-black/5 text-black/70 hover:bg-black/10'
              }`}
            >
              <FolderOpen size={16} />
              Open
            </button>
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Save size={16} />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 overflow-hidden ${isDark ? 'bg-[#070707]' : 'bg-[#fbfbfb]'}`}>
          <Editor
            content={content}
            onChange={onChange}
            theme={theme}
            fontFamily={fontFamily}
            fontSize={fontSize}
            lineHeight={lineHeight}
            showLineNumbers={showLineNumbers}
            wordWrap={wordWrap}
            onTextSelect={() => ''}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        className={`border-t border-white/10 px-6 py-3 text-xs ${
          isDark ? 'bg-[#0a0a0a] text-white/60' : 'bg-[#f9f9f9] text-black/60'
        }`}
      >
        <p>Rich text editor • Save in multiple formats (DOCX, PDF, Markdown, Text) • Ctrl+S to save</p>
      </div>
    </motion.div>
  )
}
