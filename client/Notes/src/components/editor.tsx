"use client"

import { Tiptap, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { MenuBar } from './menuBar'

function Editor() {
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Start Writing</p>',
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