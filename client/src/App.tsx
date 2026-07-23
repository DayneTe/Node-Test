'use client'
import { useEffect, useRef, useState } from "react";
import "./App.css";
import Note from "./components/note";

interface NoteData {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
}

const DEFAULT_NOTE = {
  x: 100,
  y: 100,
  width: 360,
  height: 200,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const sanitizeNote = (note: NoteData): NoteData => ({
  ...note,
  x: Number.isFinite(note.x) ? clamp(Math.round(note.x), -2000, 5000) : DEFAULT_NOTE.x,
  y: Number.isFinite(note.y) ? clamp(Math.round(note.y), -2000, 5000) : DEFAULT_NOTE.y,
  width: Number.isFinite(note.width) ? clamp(Math.round(note.width), 360, 1600) : DEFAULT_NOTE.width,
  height: Number.isFinite(note.height) ? clamp(Math.round(note.height), 160, 1200) : DEFAULT_NOTE.height,
});

function App() {
  const [panelState, setOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<NoteData[]>([]);
  const saveTimers = useRef<Record<string, number>>({});

  useEffect(() => {
    fetch("http://localhost:3000/api/notes")
      .then((response) => response.json())
      .then((savedNotes: NoteData[]) => setNotes(savedNotes.map(sanitizeNote)))
      .catch((error) => console.error("Unable to load notes:", error));
  }, []);

  useEffect(() => {
    const timers = saveTimers.current;

    return () => {
      Object.values(timers).forEach(window.clearTimeout);
    };
  }, []);

  const saveNote = (note: NoteData) => {
    const safeNote = sanitizeNote(note);

    window.clearTimeout(saveTimers.current[safeNote.id]);

    saveTimers.current[safeNote.id] = window.setTimeout(() => {
      fetch(`http://localhost:3000/api/notes/${safeNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(safeNote),
      }).catch((error) => console.error("Unable to save note:", error));
    }, 300);
  };

  const createNote = () => {
    const newNote: NoteData = {
        id: crypto.randomUUID(),
        ...DEFAULT_NOTE,
        content: "",
    };

    setNotes(prev => [...prev, newNote]);
    fetch("http://localhost:3000/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    }).catch((error) => console.error("Unable to create note:", error));
};

  const deleteNote = (id: string) => {
    window.clearTimeout(saveTimers.current[id]);
    delete saveTimers.current[id];

    setNotes(notes => notes.filter(note => note.id !== id));

    fetch(`http://localhost:3000/api/notes/${id}`, {
      method: "DELETE",
    }).catch((error) => console.error("Unable to delete note:", error));
  };

  return (
    <>
      <section className={`sidePanel ${panelState ? "sidePanel--open" : ""}`}>
        <button
          className={`${panelState ? "sidePanelButton " : "sidePanelButton--hidden"} `}
          onClick={() => setOpen((prev) => !prev)}
        >
          {"<"}
        </button>

        <h2 className="mx-auto text-white text-3xl">Add Note</h2>
        <button onClick={createNote}><div className="NoteButton" /></button>
      </section>

      <div className={`openButton ${panelState ? "openButton--hidden" : ""}`}>
        <button onClick={() => setOpen((prev) => !prev)}>{">"}</button>
      </div>

      <section id="center">

        {notes.map(note => (
          <Note
            key={note.id}
            note={note}
            onUpdate={(updated) =>
              {
                const safeNote = sanitizeNote(updated);
                setNotes(notes =>
                  notes.map(n => n.id === safeNote.id ? safeNote : n)
                );
                saveNote(safeNote);
              }
            }
            onDelete={deleteNote}
          />
        ))}

      </section>
    </>
  );
}

export default App;
