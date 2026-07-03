# AuraPad

AuraPad is a browser-based rich-text notepad built with React, TypeScript, and Vite. It provides a polished writing experience with formatting controls, file export/import, and a clean editor UI.

## Features

- Rich-text editing with bold, italic, underline, and strikethrough
- Save and export content as `.txt`, `.md`, `.pdf`, and `.docx`
- Open `.txt`, `.md`, and `.docx` files
- Auto-save content in browser storage
- Live word count, character count, and reading time
- Light/dark theme toggle and fullscreen mode
- Find & replace support
- Toolbar shortcuts and active formatting state
- Font size and display controls

## Getting Started

From the project root, install dependencies inside `app`:

```bash
cd app
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## App Structure

- `app/src/App.tsx` — main application logic, editor state, formatting commands, export handlers, and settings
- `app/src/components/Toolbar.tsx` — toolbar UI, formatting buttons, and action controls
- `app/src/components/Editor.tsx` — rich-text editable area with selection and format state handling
- `app/src/components/SaveDialog.tsx` — save dialog with filename editing and export options
- `app/src/lib/docxUtils.ts` — DOCX import/export helper functions
- `app/src/hooks` — custom hooks for auto-save and keyboard shortcuts

## Export Formats

- `.txt` — plain text export
- `.md` — Markdown export with formatting conversion
- `.pdf` — PDF export using `html2pdf.js`
- `.docx` — Microsoft Word export using `docx`

## Notes

- The editor uses browser `execCommand` for rich-text formatting.
- Toolbar buttons update their active state based on the current text selection.
- The file name can be edited before saving exported files.

## Dependencies

Key dependencies include:

- `react`, `react-dom`, `vite`
- `lucide-react` for toolbar icons
- `framer-motion` for UI animations
- `docx` and `html2pdf.js` for export support
- `@radix-ui/react-*` for UI primitives
- `tailwindcss` for styling

## License

This project is currently private and intended for personal use.
