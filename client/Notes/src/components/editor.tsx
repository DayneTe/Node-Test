"use client"
import { Tiptap, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from "@tiptap/extension-text-align"
import { MenuBar } from './menuBar'
import '../index.css'
import { ListKit } from '@tiptap/extension-list'

interface EditorProps {
    content: string;
    onChange: (content:string) => void
}

function Editor({ content, onChange }: EditorProps) {
    const editor = useEditor({
        extensions: [
            ListKit,
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
            }),

        ],
        content: content,
        editorProps: {
            attributes: {
                class: "p-2"
            }
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        }
    });

    if (!editor) return null

    return (
        <Tiptap editor={editor}>
            <MenuBar editor={editor} />
            <Tiptap.Content />
        </Tiptap>
    )
}

export default Editor