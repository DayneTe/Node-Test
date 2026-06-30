import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { BoldIcon, Heading1Icon, Heading2Icon, Heading3Icon, ItalicIcon, ListCheckIcon, ListIcon, ListOrderedIcon, RedoIcon, StrikethroughIcon, TextAlignCenterIcon, TextAlignEndIcon, TextAlignStartIcon, UndoIcon } from 'lucide-react'
import { menuBarStateSelector } from './menuBarState.tsx'
import { Toggle } from '@base-ui/react/toggle'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu.tsx'

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

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button><Heading1Icon /></button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="flex flex-row gap-3 w-auto shadow-lg">

                        <DropdownMenuItem className="text-black flex items-center justify-center rounded hover:bg-gray-100"
                            onClick={() =>
                                editor.chain().focus().toggleHeading({ level: 1 }).run()
                            }
                        >
                            <Heading1Icon />
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-black flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
                            onClick={() =>
                                editor.chain().focus().toggleHeading({ level: 2 }).run()
                            }
                        >
                            <Heading2Icon />
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-black flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
                            onClick={() =>
                                editor.chain().focus().toggleHeading({ level: 3 }).run()
                            }
                        >
                            <Heading3Icon />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button><ListIcon /></button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="flex flex-row gap-3 w-auto shadow-lg">
                        <DropdownMenuItem className="text-black flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                        >
                            <ListIcon />
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-black flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        >
                            <ListOrderedIcon />
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-black flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
                            onClick={() => editor.chain().focus().toggleTaskList().run()}
                        >
                            <ListCheckIcon />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button><TextAlignStartIcon /></button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="flex flex-row gap-3 w-auto shadow-lg">
                        <DropdownMenuItem className="text-black flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
                            onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        >
                            <TextAlignStartIcon />
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-black flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
                            onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        >
                            <TextAlignCenterIcon />
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-black flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
                            onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        >
                            <TextAlignEndIcon />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

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