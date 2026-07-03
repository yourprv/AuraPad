import { useState, useRef, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { useNavigate, Routes, Route } from 'react-router'
import AuroraBackground from './components/AuroraBackground'
import Toolbar from './components/Toolbar'
import Editor from './components/Editor'
import type { EditorRef } from './components/Editor'
import FindReplace from './components/FindReplace'
import ShortcutsDialog from './components/ShortcutsDialog'
import SettingsDialog from './components/SettingsDialog'
import SaveDialog from './components/SaveDialog'
import { useAutoSave, loadSettings, saveSettings } from './hooks/useAutoSave'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

const DEFAULT_CONTENT = '<div>Welcome to AuraPad</div><div><br></div><div>Start writing your masterpiece here...</div><div><br></div><div>This is a premium, distraction-free notepad designed for focused writing. Enjoy the smooth animations, beautiful typography, and powerful features.</div><div><br></div><div><b>Features:</b></div><div>- Word and character count</div><div>- Auto-save to browser storage</div><div>- Light and dark themes</div><div>- Multiple font families and sizes</div><div>- Find and replace</div><div>- Keyboard shortcuts</div><div>- Fullscreen mode</div><div><br></div><div>Press Ctrl+S to save your work as a .txt file.</div>'

function App() {
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [originalContent, setOriginalContent] = useState(DEFAULT_CONTENT)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [fontFamily, setFontFamily] = useState('sans')
  const [fontSize, setFontSize] = useState(17)
  const [lineHeight, setLineHeight] = useState(1.8)
  const [showLineNumbers, setShowLineNumbers] = useState(false)
  const [wordWrap, setWordWrap] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFindReplace, setShowFindReplace] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isBoldActive, setIsBoldActive] = useState(false)
  const [isItalicActive, setIsItalicActive] = useState(false)
  const [isUnderlineActive, setIsUnderlineActive] = useState(false)
  const [isStrikethroughActive, setIsStrikethroughActive] = useState(false)
  const [fileName, setFileName] = useState('untitled')
  const editorRef = useRef<EditorRef>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Load saved settings on mount
  useEffect(() => {
    const saved = loadSettings()
    if (saved) {
      setTheme(saved.theme)
      setFontFamily(saved.fontFamily)
      setFontSize(saved.fontSize)
      setLineHeight(saved.lineHeight)
      setShowLineNumbers(saved.showLineNumbers)
      setWordWrap(true)
    }
  }, [])

  // Save settings when they change
  useEffect(() => {
    saveSettings({ theme, fontFamily, fontSize, lineHeight, showLineNumbers, wordWrap: true })
  }, [theme, fontFamily, fontSize, lineHeight, showLineNumbers])

  // Auto-save
  const { restoreContent, clearSaved } = useAutoSave(content, (saved) => {
    setContent(saved)
    editorRef.current?.setContent(saved)
  })

  // Restore on mount
  useEffect(() => {
    restoreContent()
  }, [])

  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = textContent ? textContent.split(/\s+/).length : 0
  const charCount = textContent.length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  const hasUnsavedChanges = content !== originalContent

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
  }, [])

  const handleNew = useCallback(() => {
    if (hasUnsavedChanges && content !== DEFAULT_CONTENT) {
      if (!window.confirm('You have unsaved changes. Start a new note?')) return
    }
    setContent('')
    setOriginalContent('')
    editorRef.current?.setContent('')
    setFileName('untitled')
    clearSaved()
  }, [hasUnsavedChanges, content, clearSaved])

  const handleOpen = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const extension = file.name.split('.').pop()?.toLowerCase()
    let html = ''

    if (extension === 'docx') {
      try {
        const { docxFileToHtml } = await import('./lib/docxUtils')
        html = await docxFileToHtml(file)
      } catch (error) {
        console.error('DOCX open failed', error)
        window.alert('Unable to open DOCX file. Please try again.')
      }
    } else {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        if (text) {
          html = text
            .split('\n')
            .map((line) => `<div>${line}</div>`)
            .join('')
          setContent(html)
          setOriginalContent(html)
          editorRef.current?.setContent(html)
          setFileName(file.name.replace(/\.[^.]+$/, ''))
        }
      }
      reader.readAsText(file)
      e.target.value = ''
      return
    }

    if (html) {
      setContent(html)
      setOriginalContent(html)
      editorRef.current?.setContent(html)
      setFileName(file.name.replace(/\.[^.]+$/, ''))
    }
    e.target.value = ''
  }, [navigate])

  const updateSelectionState = useCallback(() => {
    setIsBoldActive(document.queryCommandState('bold'))
    setIsItalicActive(document.queryCommandState('italic'))
    setIsUnderlineActive(document.queryCommandState('underline'))
    setIsStrikethroughActive(document.queryCommandState('strikeThrough'))
  }, [])

  const handleSave = useCallback(() => {
    setShowSaveDialog(true)
  }, [])

  const handleFileNameChange = useCallback((newName: string) => {
    setFileName(newName)
  }, [])

  const handleSaveTxt = useCallback(() => {
    const text = content.replace(/<div>/g, '\n').replace(/<\/div>/g, '').replace(/<br>/g, '\n').replace(/<[^>]*>/g, '')
    const blob = new Blob([text.trim()], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setOriginalContent(content)
    setShowSaveDialog(false)
  }, [content, fileName])

  const handleSavePdf = useCallback(async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const element = document.createElement('div')
      element.innerHTML = content.replace(/<div>/g, '<p>').replace(/<\/div>/g, '</p>')
      element.style.padding = '20px'
      element.style.fontFamily = 'Arial, sans-serif'
      element.style.lineHeight = '1.6'
      
      const options = {
        margin: 10,
        filename: `${fileName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' },
      }
      
      await html2pdf().set(options as any).from(element).save()
      setOriginalContent(content)
      setShowSaveDialog(false)
    } catch (error) {
      console.error('PDF export failed', error)
      window.alert('Unable to export PDF. Please try again.')
    }
  }, [content, fileName])


  const convertHtmlToMarkdown = useCallback((html: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const nodeToMarkdown = (node: Node, listType?: 'ul' | 'ol', index = 0): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.replace(/\s+/g, ' ') || ''
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return ''
      const el = node as HTMLElement
      const tag = el.tagName.toLowerCase()

      const childText = Array.from(el.childNodes)
        .map((child) => nodeToMarkdown(child, tag === 'ol' ? 'ol' : tag === 'ul' ? 'ul' : undefined, index))
        .join('')
        .trim()

      switch (tag) {
        case 'strong':
        case 'b':
          return `**${childText}**`
        case 'em':
        case 'i':
          return `*${childText}*`
        case 'u':
          return `<u>${childText}</u>`
        case 's':
        case 'strike':
        case 'del':
          return `~~${childText}~~`
        case 'blockquote':
          return childText
            .split('\n')
            .filter(Boolean)
            .map((line) => `> ${line}`)
            .join('\n')
        case 'br':
          return '\n'
        case 'div':
        case 'p':
          return `${childText}\n`
        case 'li': {
          const prefix = listType === 'ol' ? `${index + 1}. ` : '- '
          return `${prefix}${childText}\n`
        }
        case 'ul':
        case 'ol':
          return Array.from(el.children)
            .map((child, childIndex) => nodeToMarkdown(child, tag as 'ul' | 'ol', childIndex))
            .join('')
        default:
          return childText
      }
    }

    return Array.from(doc.body.childNodes).map((node) => nodeToMarkdown(node)).join('').trim()
  }, [])

  const handleSaveAsMd = useCallback(() => {
    const markdown = convertHtmlToMarkdown(content)
    const blob = new Blob([markdown.trim()], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setOriginalContent(content)
    setShowSaveDialog(false)
  }, [content, convertHtmlToMarkdown, fileName])

  const handleSaveAsDocx = useCallback(async () => {
    try {
      const { htmlToDocxBlob } = await import('./lib/docxUtils')
      const blob = await htmlToDocxBlob(content)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setOriginalContent(content)
      setShowSaveDialog(false)
    } catch (error) {
      console.error('DOCX export failed', error)
      window.alert('Unable to export DOCX. Please try again.')
    }
  }, [content, fileName])


  const handleToggleBold = useCallback(() => {
    editorRef.current?.execCommand('bold')
    requestAnimationFrame(updateSelectionState)
  }, [updateSelectionState])

  const handleToggleItalic = useCallback(() => {
    editorRef.current?.execCommand('italic')
    requestAnimationFrame(updateSelectionState)
  }, [updateSelectionState])

  const handleToggleStrikethrough = useCallback(() => {
    editorRef.current?.execCommand('strikeThrough')
    requestAnimationFrame(updateSelectionState)
  }, [updateSelectionState])

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const handleToggleUnderline = useCallback(() => {
    editorRef.current?.execCommand('underline')
    requestAnimationFrame(updateSelectionState)
  }, [updateSelectionState])

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }, [])

  useKeyboardShortcuts({
    onSave: handleSave,
    onNew: handleNew,
    onOpen: handleOpen,
    onFind: () => setShowFindReplace((prev) => !prev),
    onToggleTheme: handleToggleTheme,
    onToggleFullscreen: handleToggleFullscreen,
  })

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const isDark = theme === 'dark'

  return (
    <div className={`relative w-screen h-screen overflow-hidden ${isDark ? 'dark' : ''}`}>
      <AuroraBackground />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Title Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between px-6 py-2 backdrop-blur-md bg-black/20 border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-[#fabe00]/10">
              <FileText size={16} className="text-[#fabe00]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white/90">AuraPad</h1>
              <p className="text-[10px] text-white/40">{fileName}.txt</p>
            </div>
          </div>
          <AnimatePresence>
            {hasUnsavedChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 text-xs text-[#fabe00]/70"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#fabe00] pulse-unsaved" />
                Unsaved changes
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Toolbar */}
        <Toolbar
          onNew={handleNew}
          onOpen={handleOpen}
          onSave={handleSave}
          onToggleBold={handleToggleBold}
          onToggleItalic={handleToggleItalic}
          onToggleUnderline={handleToggleUnderline}
          onToggleStrikethrough={handleToggleStrikethrough}
          onFind={() => setShowFindReplace((prev) => !prev)}
          onToggleTheme={handleToggleTheme}
          onToggleFullscreen={handleToggleFullscreen}
          onToggleLineNumbers={() => setShowLineNumbers((prev) => !prev)}
          onToggleWordWrap={() => setWordWrap((prev) => !prev)}
          onShowShortcuts={() => setShowShortcuts(true)}
          onShowSettings={() => setShowSettings(true)}
          onFontSizeChange={setFontSize}
          isBoldActive={isBoldActive}
          isItalicActive={isItalicActive}
          isUnderlineActive={isUnderlineActive}
          isStrikethroughActive={isStrikethroughActive}
          theme={theme}
          isFullscreen={isFullscreen}
          showLineNumbers={showLineNumbers}
          wordWrap={wordWrap}
          wordCount={wordCount}
          charCount={charCount}
          readingTime={readingTime}
          hasUnsavedChanges={hasUnsavedChanges}
          fontSize={fontSize}
        />

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Routes>
            <Route
              path="/*"
              element={
                <>
                  <Editor
                    ref={editorRef}
                    content={content}
                    onChange={handleContentChange}
                    theme={theme}
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                    lineHeight={lineHeight}
                    showLineNumbers={showLineNumbers}
                    wordWrap={wordWrap}
                    onTextSelect={() => editorRef.current?.getSelectedText() || ''}
                    onSelectionChange={updateSelectionState}
                  />

                  <FindReplace
                    isOpen={showFindReplace}
                    onClose={() => setShowFindReplace(false)}
                    editorRef={editorRef}
                    theme={theme}
                  />
                </>
              }
            />
          </Routes>
        </div>

        {/* Bottom Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between px-6 py-2 backdrop-blur-md bg-black/30 border-t border-white/5 text-xs"
        >
          <div className="flex items-center gap-4 text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Ready
            </span>
            <span>{fontFamily === 'serif' ? 'Serif' : fontFamily === 'mono' ? 'Mono' : 'Sans'}</span>
            <span>{fontSize}px</span>
          </div>
          <div className="flex items-center gap-6 text-white/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-white/30">Words</span>
                <span className="font-mono font-medium text-white/70">{wordCount}</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <span className="text-white/30">Characters</span>
                <span className="font-mono font-medium text-white/70">{charCount}</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <span className="text-white/30">Reading time</span>
                <span className="font-mono font-medium text-white/70">{readingTime} min</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Dialogs */}
      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        fileName={fileName}
        onFileNameChange={handleFileNameChange}
        onSaveTxt={handleSaveTxt}
        onSaveDocx={handleSaveAsDocx}
        onSavePdf={handleSavePdf}
        onSaveMd={handleSaveAsMd}
      />
      <ShortcutsDialog
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        theme={theme}
      />
      <SettingsDialog
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        theme={theme}
        fontFamily={fontFamily}
        fontSize={fontSize}
        lineHeight={lineHeight}
        showLineNumbers={showLineNumbers}
        wordWrap={wordWrap}
        onThemeChange={setTheme}
        onFontFamilyChange={setFontFamily}
        onFontSizeChange={setFontSize}
        onLineHeightChange={setLineHeight}
        onToggleLineNumbers={() => setShowLineNumbers((prev) => !prev)}
        onToggleWordWrap={() => setWordWrap((prev) => !prev)}
      />
    </div>
  )
}

export default App
