'use client'
import React from "react";
import Moveable from "react-moveable";
import Editor from "./editor";

interface NoteData {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
}

function Note({ note, onUpdate }: {
    note: NoteData;
    onUpdate: (note: NoteData) => void;
}) {
    const targetRef = React.useRef<HTMLDivElement>(null);

    return (
        <>
            <div className="TestNote"
                style={{
                    width: note.width,
                    height: note.height,
                    transform: `translate(${note.x}px, ${note.y}px)`
                }}
                ref={targetRef}>

                <Editor content={note.content} onChange={(content) => onUpdate({ ...note, content })} />

            </div>

            <Moveable
                target={targetRef}
                dragTarget={'.drag_area'}
                origin={false}
                draggable={true}
                resizable={true}
                edge={true}
                displayAroundControls={true}
                linePadding={10}
                throttleDrag={1}
                startDragRotate={0}
                throttleDragRotate={0}
                onResize={({ width, height, drag }) => {
                    onUpdate({
                        ...note,
                        width,
                        height,
                        x: drag.beforeTranslate[0],
                        y: drag.beforeTranslate[1]
                    });
                }}
                onDrag={({ beforeTranslate }) => {
                    onUpdate({
                        ...note,
                        x: beforeTranslate[0],
                        y: beforeTranslate[1]
                    });
                }}
            />
        </>
    )
}
export default Note;