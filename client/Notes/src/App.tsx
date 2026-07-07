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

function App() {
  const [panelState, setOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<NoteData[]>([]);
  const saveTimers = useRef<Record<string, number>>({});

  useEffect(() => {
    fetch("http://localhost:3000/api/notes")
      .then((response) => response.json())
      .then((savedNotes: NoteData[]) => setNotes(savedNotes))
      .catch((error) => console.error("Unable to load notes:", error));
  }, []);

  useEffect(() => {
    return () => {
      Object.values(saveTimers.current).forEach(window.clearTimeout);
    };
  }, []);

  const saveNote = (note: NoteData) => {
    window.clearTimeout(saveTimers.current[note.id]);

    saveTimers.current[note.id] = window.setTimeout(() => {
      fetch(`http://localhost:3000/api/notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      }).catch((error) => console.error("Unable to save note:", error));
    }, 300);
  };

  const createNote = () => {
    const newNote: NoteData = {
        id: crypto.randomUUID(),
        x: 100,
        y: 100,
        width: 300,
        height: 200,
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

  return (
    <>
      <section className={`sidePanel ${panelState ? "sidePanel--open" : ""}`}>
        <button
          className={`${panelState ? "sidePanelButton " : "sidePanelButton--hidden"} `}
          onClick={() => setOpen((prev) => !prev)}
        >
          {"<"}
        </button>

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
                setNotes(notes =>
                  notes.map(n => n.id === updated.id ? updated : n)
                );
                saveNote(updated);
              }
            }
          />
        ))}

      </section>
    </>
  );
}

export default App;
