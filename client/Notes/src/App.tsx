'use client'
import { useState } from "react";
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
              setNotes(notes =>
                notes.map(n => n.id === updated.id ? updated : n)
              )
            }
          />
        ))}

      </section>
    </>
  );
}

export default App;
