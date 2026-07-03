import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { motion } from 'framer-motion'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  theme: 'light' | 'dark'
  fontFamily: string
  fontSize: number
  lineHeight: number
  showLineNumbers: boolean
  wordWrap: boolean
  onTextSelect: () => string
  onSelectionChange?: () => void
}

export interface EditorRef {
  getContent: () => string
  setContent: (content: string) => void
  focus: () => void
  getSelectedText: () => string
  replaceText: (find: string, replace: string, all?: boolean) => number
  insertText: (text: string) => void
  wrapSelection: (before: string, after: string) => void
  execCommand: (command: string, value?: string) => void
}

const Editor = forwardRef<EditorRef, EditorProps>(({
  content,
  onChange,
  theme,
  fontFamily,
  fontSize,
  lineHeight,
  showLineNumbers,
  wordWrap,
  onSelectionChange,
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const isUpdatingRef = useRef(false)
  const selectionRangeRef = useRef<Range | null>(null)

  const saveSelection = useCallback(() => {
    const editor = editorRef.current
    const selection = window.getSelection()
    if (!editor || !selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (!editor.contains(range.commonAncestorContainer)) return

    selectionRangeRef.current = range.cloneRange()
  }, [])

  const restoreSelection = useCallback(() => {
    const editor = editorRef.current
    const selection = window.getSelection()
    const range = selectionRangeRef.current
    if (!editor || !selection || !range) return

    selection.removeAllRanges()
    selection.addRange(range)
    editor.focus()
  }, [])

  const execCommand = useCallback((command: string, value?: string) => {
    const editor = editorRef.current
    if (!editor) return
    restoreSelection()
    editor.focus()
    document.execCommand(command, false, value ?? undefined)
    onChange(editor.innerHTML)
  }, [onChange, restoreSelection])

  const getContent = useCallback(() => {
    return editorRef.current?.innerHTML || ''
  }, [])

  const setContent = useCallback((html: string) => {
    if (editorRef.current) {
      isUpdatingRef.current = true
      editorRef.current.innerHTML = html
      isUpdatingRef.current = false
    }
  }, [])

  const focus = useCallback(() => {
    editorRef.current?.focus()
  }, [])

  const getSelectedText = useCallback(() => {
    const selection = window.getSelection()
    return selection?.toString() || ''
  }, [])

  const replaceText = useCallback((find: string, replace: string, all = false): number => {
    if (!editorRef.current || !find) return 0
    const text = editorRef.current.innerText
    let count = 0
    
    if (all) {
      const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      const newHtml = editorRef.current.innerHTML.replace(regex, replace)
      count = (text.match(regex) || []).length
      editorRef.current.innerHTML = newHtml
    } else {
      restoreSelection()
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const selectedText = range.toString()
        if (selectedText.toLowerCase() === find.toLowerCase()) {
          range.deleteContents()
          range.insertNode(document.createTextNode(replace))
          count = 1
        }
      }
    }
    
    onChange(editorRef.current.innerHTML)
    return count
  }, [onChange, restoreSelection])

  const insertText = useCallback((text: string) => {
    if (!editorRef.current) return
    restoreSelection()
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(text))
      range.collapse(false)
    } else {
      editorRef.current.innerHTML += text
    }
    onChange(editorRef.current.innerHTML)
  }, [onChange, restoreSelection])

  const wrapSelection = useCallback((before: string, after: string) => {
    if (!editorRef.current) return
    restoreSelection()
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const selectedText = range.toString()
      if (selectedText) {
        range.deleteContents()
        const wrapper = document.createElement('span')
        wrapper.innerHTML = before + selectedText + after
        while (wrapper.firstChild) {
          range.insertNode(wrapper.firstChild)
          range.collapse(false)
        }
      } else {
        insertText(before + after)
      }
      onChange(editorRef.current.innerHTML)
    }
  }, [insertText, onChange, restoreSelection])

  useImperativeHandle(ref, () => ({
    getContent,
    setContent,
    focus,
    getSelectedText,
    replaceText,
    insertText,
    wrapSelection,
    execCommand,
  }))

  const handleInput = useCallback(() => {
    if (!isUpdatingRef.current && editorRef.current) {
      onChange(editorRef.current.innerHTML)
      onSelectionChange?.()
    }
  }, [onChange, onSelectionChange])

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content && !isUpdatingRef.current) {
      isUpdatingRef.current = true
      editorRef.current.innerHTML = content
      isUpdatingRef.current = false
    }
  }, [content])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        document.execCommand('insertText', false, '  ')
      }
    }

    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return
      const range = selection.getRangeAt(0)
      if (!editor.contains(range.commonAncestorContainer)) return
      saveSelection()
      onSelectionChange?.()
    }

    editor.addEventListener('keydown', handleKeyDown)
    editor.addEventListener('mouseup', handleSelectionChange)
    editor.addEventListener('keyup', handleSelectionChange)
    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      editor.removeEventListener('keydown', handleKeyDown)
      editor.removeEventListener('mouseup', handleSelectionChange)
      editor.removeEventListener('keyup', handleSelectionChange)
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [saveSelection, onSelectionChange])

  const getFontFamily = () => {
    switch (fontFamily) {
      case 'serif':
        return "'Noto Serif JP', 'Georgia', serif"
      case 'mono':
        return "'Fira Code', 'Courier New', monospace"
      default:
        return "'Noto Sans JP', 'Inter', system-ui, sans-serif"
    }
  }

  const isDark = theme === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`flex-1 flex overflow-hidden ${
        isDark ? 'bg-[#0a0a0a]/80' : 'bg-[#fdfde7]/90'
      } backdrop-blur-md`}
    >
      {/* Line Numbers */}
      {showLineNumbers && (
        <div
          className={`select-none text-right pr-4 py-8 text-xs overflow-hidden ${
            isDark ? 'text-white/20 bg-black/20' : 'text-black/20 bg-white/20'
          }`}
          style={{
            fontFamily: "'Fira Code', monospace",
            minWidth: '3.5em',
            fontSize: `${fontSize * 0.85}px`,
            lineHeight: `${lineHeight}`,
          }}
        >
          {Array.from({ length: Math.max(content.split('<div>').length, content.split('<p>').length, 1) }, (_, i) => (
            <div key={i} className="leading-relaxed">
              {i + 1}
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder="Start writing your masterpiece..."
          className={`editor-content w-full min-h-full px-8 py-8 outline-none ${
            isDark ? 'text-white/90' : 'text-[#1a1a1a]'
          }`}
          style={{
            fontFamily: getFontFamily(),
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}`,
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
            wordWrap: wordWrap ? 'break-word' : 'normal',
            overflowWrap: wordWrap ? 'break-word' : 'normal',
          }}
        />
      </div>
    </motion.div>
  )
})

Editor.displayName = 'Editor'
export default Editor
