import { useTiptap } from '@tiptap/react'

function TestMenuBar() {
  const { editor } = useTiptap()

  if (!editor) return null

  return (
    <div className="flex gap-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </button>
    </div>
  )
}
export default TestMenuBar;