import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { BoldIcon, Heading1Icon, Heading2Icon, Heading3Icon, ItalicIcon, ListCheckIcon, ListIcon, ListOrderedIcon, RedoIcon, StrikethroughIcon, UndoIcon } from 'lucide-react'
import { menuBarStateSelector } from './menuBarState.tsx'
import { Toggle } from '@base-ui/react/toggle'


export const MenuBar = ({ editor }: { editor: Editor | null }) => {
    const editorState = useEditorState({
        editor,
        selector: menuBarStateSelector,
    })

    if (!editor) {
        return null
    }

    return (
        <div className="p-2">
            <div className='flex gap-4'>
                <Toggle
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editorState.canBold}
                    className={editorState.isBold ? 'is-active' : ''}
                >
                    <BoldIcon />
                </Toggle>
                <Toggle
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editorState.canItalic}
                    className={editorState.isItalic ? 'is-active' : ''}
                >
                    <ItalicIcon />
                </Toggle>
                <Toggle
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editorState.canStrike}
                    className={editorState.isStrike ? 'is-active' : ''}
                >
                    <StrikethroughIcon />
                </Toggle>
                <Toggle
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editorState.isHeading1 ? 'is-active' : ''}
                >
                    <Heading1Icon />
                </Toggle>
                <Toggle
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editorState.isHeading2 ? 'is-active' : ''}
                >
                    <Heading2Icon />
                </Toggle>
                <Toggle
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editorState.isHeading3 ? 'is-active' : ''}
                >
                    <Heading3Icon />
                </Toggle>

                <Toggle
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editorState.isBulletList ? 'is-active' : ''}
                >
                    <ListIcon />
                </Toggle>
                <Toggle
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editorState.isOrderedList ? 'is-active' : ''}
                >
                    <ListOrderedIcon />
                </Toggle>
                <Toggle
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    className={editorState.isTaskList ? 'is-active' : ''}
                >
                    <ListCheckIcon />
                </Toggle>
                <button onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo}>
                    <UndoIcon />
                </button>
                <button onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo}>
                    <RedoIcon />
                </button>
            </div>
        </div>
    )
}