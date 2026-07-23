import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { BoldIcon, EllipsisIcon, Heading1Icon, Heading2Icon, Heading3Icon, HeadingIcon, ItalicIcon, ListCheckIcon, ListIcon, ListOrderedIcon, RedoIcon, StrikethroughIcon, TextAlignCenterIcon, TextAlignEndIcon, TextAlignJustifyIcon, TextAlignStartIcon, TrashIcon, UndoIcon } from 'lucide-react'
import { menuBarStateSelector } from './menuBarState.tsx'
import { Toggle } from '@base-ui/react/toggle'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu.tsx'

export const MenuBar = ({
    editor,
    onDelete,
    onDragHandleReady,
}: {
    editor: Editor | null;
    onDelete: () => void;
    onDragHandleReady: (element: HTMLDivElement | null) => void;
}) => {
    const editorState = useEditorState({
        editor,
        selector: menuBarStateSelector,
    })

    if (!editor || !editorState) {
        return null
    }

    return (
        <>
        <div
            ref={onDragHandleReady}
            className='drag_area bg-gray-200 h-3 w-full flex justify-center rounded-t-md relative'
        >
            <EllipsisIcon className='w-4 mx-auto absolute left-1/2'/>
            <button
                aria-label="Delete note"
                title="Delete note"
                className="ml-auto cursor-pointer"
                onClick={onDelete}
                onPointerDown={(event) => event.stopPropagation()}
            >
                <TrashIcon className='w-4' />
            </button>
            </div>
        <div className="py-1 bg-gray-200">
            <div className='flex justify-evenly'>
                <Toggle
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editorState.canBold}
                    className={`toggleButton ${editorState.isBold ? 'is-active' : ''}`}
                >
                    <BoldIcon />
                </Toggle>

                <Toggle
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editorState.canItalic}
                    className={`toggleButton ${editorState.isItalic ? 'is-active' : ''}`}
                >
                    <ItalicIcon />
                </Toggle>
                <Toggle
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editorState.canStrike}
                    className={`toggleButton ${editorState.isStrike ? 'is-active' : ''}`}
                >
                    <StrikethroughIcon />
                </Toggle>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button className="toggleButton"><HeadingIcon /></button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="flex flex-row gap-3 w-auto shadow-lg bg-white">

                        <DropdownMenuItem className={`dropdownButton ${editorState.isHeading1 ? 'is-active' : ''}`}
                            onClick={() =>
                                editor.chain().focus().toggleHeading({ level: 1 }).run()
                            }
                        >
                            <Heading1Icon />
                        </DropdownMenuItem>

                        <DropdownMenuItem className={`dropdownButton ${editorState.isHeading2 ? 'is-active' : ''}`}
                            onClick={() =>
                                editor.chain().focus().toggleHeading({ level: 2 }).run()
                            }
                        >
                            <Heading2Icon />
                        </DropdownMenuItem>

                        <DropdownMenuItem className={`dropdownButton ${editorState.isHeading3 ? 'is-active' : ''}`}
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
                        <button className="toggleButton"><ListIcon /></button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="flex flex-row gap-3 w-auto shadow-lg bg-white">
                        <DropdownMenuItem className={`dropdownButton ${editorState.isBulletList ? 'is-active' : ''}`}
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                        >
                            <ListIcon />
                        </DropdownMenuItem>

                        <DropdownMenuItem className={`dropdownButton ${editorState.isOrderedList ? 'is-active' : ''}`}
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        >
                            <ListOrderedIcon />
                        </DropdownMenuItem>

                        <DropdownMenuItem className={`dropdownButton ${editorState.isTaskList ? 'is-active' : ''}`}
                            onClick={() => editor.chain().focus().toggleTaskList().run()}
                        >
                            <ListCheckIcon />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button className="toggleButton"><TextAlignStartIcon /></button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="flex flex-row gap-3 w-auto shadow-lg bg-white">
                        <DropdownMenuItem className={`dropdownButton ${editorState.isAlignLeft ? 'is-active' : ''}`}
                            onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        >
                            <TextAlignStartIcon />
                        </DropdownMenuItem>

                        <DropdownMenuItem className={`dropdownButton ${editorState.isAlignCenter ? 'is-active' : ''}`}
                            onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        >
                            <TextAlignCenterIcon />
                        </DropdownMenuItem>

                        <DropdownMenuItem className={`dropdownButton ${editorState.isAlignRight ? 'is-active' : ''}`}
                            onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        >
                            <TextAlignEndIcon />
                        </DropdownMenuItem>

                        <DropdownMenuItem className={`dropdownButton ${editorState.isAlignJustify ? 'is-active' : ''}`}
                            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                        >
                            <TextAlignJustifyIcon />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <button
                    className="toggleButton"
                    onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo}>
                    <UndoIcon />
                </button>
                <button
                    className="toggleButton"
                    onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo}>
                    <RedoIcon />
                </button>
            </div>
        </div>
        </>
    )
}
