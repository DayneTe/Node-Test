"use client"
import { Tiptap, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from "@tiptap/extension-text-align"
import { MenuBar } from './menuBar'
import '../index.css'

function Editor() {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc ml-4"
                    }
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal ml-4"
                    }
                }
                
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"]
            })
        ],
        content: '<p>...</p>',
        editorProps: {
            attributes: {
                class: "p-2"
            }
        }
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