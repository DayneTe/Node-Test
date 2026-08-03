'use client'
import { useEffect, useRef, useState } from "react";
import "./App.css";
import Note from "./components/note";
import { auth, ensureAnonymousUser } from "./components/firebase";
import { onAuthStateChanged } from "firebase/auth";
const API_URL = import.meta.env.VITE_API_URL

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
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const saveTimers = useRef<Record<string, number>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthReady(true);
        return;
      }

      ensureAnonymousUser().catch((error: unknown) => {
        console.error("Unable to sign in anonymously:", error);
        setAuthError(
          "Unable to start a guest session. Confirm Anonymous sign-in is enabled in Firebase and try again.",
        );
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authReady) return;

    async function loadNotes() {
      const token = await auth.currentUser?.getIdToken();

      const response = await fetch(`${API_URL}/api/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const savedNotes: NoteData[] = await response.json();
      setNotes(savedNotes.map(sanitizeNote));
    }

    loadNotes().catch((error) =>
      console.error("Unable to load notes:", error)
    );
  }, [authReady]);

  const saveNote = (note: NoteData) => {
    const safeNote = sanitizeNote(note);

    window.clearTimeout(saveTimers.current[safeNote.id]);

    saveTimers.current[safeNote.id] = window.setTimeout(async () => {
      try {
        const token = await auth.currentUser?.getIdToken();

        await fetch(`${API_URL}/api/notes/${safeNote.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(safeNote),
        });
      } catch (error) {
        console.error("Unable to save note:", error);
      }
    }, 300);
  };

  const createNote = async () => {
    if (!authReady) return;

    const newNote: NoteData = {
      id: crypto.randomUUID(),
      ...DEFAULT_NOTE,
      content: "",
    };

    setNotes(prev => [...prev, newNote]);

    try {
      const token = await auth.currentUser?.getIdToken();

      await fetch(`${API_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNote),
      });
    } catch (error) {
      console.error("Unable to create note:", error);
    }
  };

  const deleteNote = async (id: string) => {
    if (!authReady) return;

    window.clearTimeout(saveTimers.current[id]);
    delete saveTimers.current[id];

    setNotes(notes => notes.filter(note => note.id !== id));

    try {
      const token = await auth.currentUser?.getIdToken();

      await fetch(`${API_URL}/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Unable to create note:", error);
    }
  };

  return (
    <>
      {authError && <p role="alert">{authError}</p>}
      <section className={`sidePanel ${panelState ? "sidePanel--open" : ""}`}>
        <button
          className={`${panelState ? "sidePanelButton " : "sidePanelButton--hidden"} `}
          onClick={() => setOpen((prev) => !prev)}
        >
          {"<"}
        </button>

        <h2 className="mx-auto text-white text-3xl">Add Note</h2>
        <button onClick={createNote} disabled={!authReady}><div className="NoteButton" /></button>
      </section>

      <div className={`openButton ${panelState ? "openButton--hidden" : ""}`}>
        <button onClick={() => setOpen((prev) => !prev)}>{">"}</button>
      </div>

      <section id="center">

        {notes.map(note => (
          <Note
            key={note.id}
            note={note}
            onUpdate={(updated) => {
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
