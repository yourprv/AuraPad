import mammoth from 'mammoth'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from 'docx'

const normalizeText = (text: string) => text.replace(/\u00a0/g, ' ')

interface RunStyles {
  bold?: boolean
  italics?: boolean
  underline?: boolean
  strike?: boolean
}

const getTextRuns = (node: Node, styles: RunStyles = {}): TextRun[] => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = normalizeText(node.textContent || '')
    return [
      new TextRun({
        text,
        bold: styles.bold,
        italics: styles.italics,
        ...(styles.underline && { underline: {} }),
        strike: styles.strike,
      }),
    ]
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return []
  }

  const element = node as HTMLElement
  const tag = element.tagName.toLowerCase()
  const nextStyles: RunStyles = { ...styles }

  if (tag === 'strong' || tag === 'b') nextStyles.bold = true
  if (tag === 'em' || tag === 'i') nextStyles.italics = true
  if (tag === 'u') nextStyles.underline = true
  if (tag === 'strike' || tag === 's' || tag === 'del') nextStyles.strike = true

  if (tag === 'br') {
    return [
      new TextRun({
        text: '\n',
        bold: styles.bold,
        italics: styles.italics,
        ...(styles.underline && { underline: {} }),
        strike: styles.strike,
      }),
    ]
  }

  return Array.from(element.childNodes).flatMap((child) =>
    getTextRuns(child, nextStyles),
  )
}

const paragraphFromElement = (element: HTMLElement): Paragraph => {
  const tag = element.tagName.toLowerCase()
  const runs = Array.from(element.childNodes).flatMap((child) =>
    getTextRuns(child),
  )

  if (runs.length === 0) {
    runs.push(new TextRun({ text: '' }))
  }

  const paragraphOptions: Record<string, any> = { children: runs }

  if (tag === 'h1') paragraphOptions.heading = HeadingLevel.HEADING_1
  if (tag === 'h2') paragraphOptions.heading = HeadingLevel.HEADING_2
  if (tag === 'blockquote') paragraphOptions.indent = { left: 720 }

  return new Paragraph(paragraphOptions)
}

export const docxFileToHtml = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: ['b => strong', 'i => em', 'u => u', 'strike => s'],
    },
  )
  return result.value
}

export const htmlToDocxBlob = async (html: string): Promise<Blob> => {
  const parser = new DOMParser()
  const document = parser.parseFromString(html, 'text/html')
  const paragraphs: Paragraph[] = []

  document.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = normalizeText(node.textContent || '')
      if (text.trim()) {
        paragraphs.push(new Paragraph({ children: [new TextRun({ text })] }))
      }
      return
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return
    }

    const element = node as HTMLElement
    const tag = element.tagName.toLowerCase()

    if (tag === 'ul') {
      Array.from(element.querySelectorAll('li')).forEach((li) => {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: getTextRuns(li),
          }),
        )
      })
      return
    }

    if (tag === 'ol') {
      Array.from(element.querySelectorAll('li')).forEach((li, index) => {
        const runs = getTextRuns(li)
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${index + 1}. ` }),
              ...runs,
            ],
          }),
        )
      })
      return
    }

    paragraphs.push(paragraphFromElement(element))
  })

  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: '' })] }))
  }

  const doc = new Document({ sections: [{ children: paragraphs }] })
  return Packer.toBlob(doc)
}
