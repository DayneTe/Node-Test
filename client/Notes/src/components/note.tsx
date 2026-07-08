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

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

const MIN_WIDTH = 360;
const MIN_HEIGHT = 160;

const safeNumber = (value: number, fallback: number, min: number, max: number) => {
    if (!Number.isFinite(value)) return fallback;
    return clamp(Math.round(value), min, max);
};

function Note({ note, onUpdate, onDelete }: {
    note: NoteData;
    onUpdate: (note: NoteData) => void;
    onDelete: (id: string) => void;
}) {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const latestNoteRef = React.useRef(note);
    const pendingNoteRef = React.useRef<NoteData | null>(null);

    React.useEffect(() => {
        latestNoteRef.current = note;
    }, [note]);

    const paintNote = (nextNote: NoteData, transform: string) => {
        const target = targetRef.current;

        if (!target) return;

        target.style.width = `${nextNote.width}px`;
        target.style.height = `${nextNote.height}px`;
        target.style.transform = transform;
    };

    const commitPendingNote = () => {
        if (!pendingNoteRef.current) return;

        onUpdate(pendingNoteRef.current);
        pendingNoteRef.current = null;
    };

    return (
        <>
            <div className="TestNote"
                style={{
                    width: note.width,
                    height: note.height,
                    transform: `translate(${note.x}px, ${note.y}px)`
                }}
                ref={targetRef}>

                <Editor
                    content={note.content}
                    onChange={(content) => onUpdate({ ...note, content })}
                    onDelete={() => onDelete(note.id)}
                />

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
                onResizeStart={({ set, dragStart }) => {
                    set([note.width, note.height]);

                    if (dragStart) {
                        dragStart.set([note.x, note.y]);
                    }
                }}
                onResize={({ width, height, drag }) => {
                    const currentNote = latestNoteRef.current;
                    const nextNote = {
                        ...currentNote,
                        width: safeNumber(width, currentNote.width, MIN_WIDTH, 1600),
                        height: safeNumber(height, currentNote.height, MIN_HEIGHT, 1200),
                        x: safeNumber(drag.beforeTranslate[0], currentNote.x, -2000, 5000),
                        y: safeNumber(drag.beforeTranslate[1], currentNote.y, -2000, 5000)
                    };

                    pendingNoteRef.current = nextNote;
                    paintNote(nextNote, drag.transform);
                }}
                onResizeEnd={commitPendingNote}
                onDragStart={({ set }) => {
                    set([note.x, note.y]);
                }}
                onDrag={({ beforeTranslate, transform }) => {
                    const currentNote = latestNoteRef.current;
                    const nextNote = {
                        ...currentNote,
                        x: safeNumber(beforeTranslate[0], currentNote.x, -2000, 5000),
                        y: safeNumber(beforeTranslate[1], currentNote.y, -2000, 5000)
                    };

                    pendingNoteRef.current = nextNote;
                    paintNote(nextNote, transform);
                }}
                onDragEnd={commitPendingNote}
            />
        </>
    )
}
export default Note;
