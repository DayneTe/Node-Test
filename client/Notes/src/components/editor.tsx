"use client"
import { Tiptap, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { MenuBar } from './menuBar'
import '../index.css'

function Editor() {
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>...</p>',
    })

    if (!editor) return null

    return (
        <Tiptap editor={editor}>
            <MenuBar editor={editor} />
            <Tiptap.Content />
        </Tiptap>
    )
}

export default Editor