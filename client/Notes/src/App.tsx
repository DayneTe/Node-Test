'use client'
import { useState } from "react";
import "./App.css";
import Editor from "./components/editor";

type HelloResponse = { message: string };

function App() {
  const [message, setMessage] = useState<HelloResponse | null>(null);
  const [panelState, setOpen] = useState<boolean>(false);
  const [post, setPost] = useState("");

  const onChange = (content: string) => {
    setPost(content)
    console.log(content)
  }

  async function hello() {
    try {
      const response = await fetch("http://localhost:3000/api/hello");
      if (!response.ok) {
        throw new Error(`HTTP Error: , ${response.status}`);
      }
      const data = await response.json();
      setMessage(data);
      console.log(data);
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  return (
    <>
      <section className={`sidePanel ${panelState ? "sidePanel--open" : ""}`}>
        <button
          className={`${panelState ? "sidePanelButton " :"sidePanelButton--hidden"} `}
          onClick={() => setOpen((prev) => !prev)}
        >
          {"<"}
        </button>

        <div className="Note" />
        <div className="Note" />
        <div className="Note" />
        <div className="Note" />
      </section>

      <div className={`openButton ${panelState ? "openButton--hidden" : ""}`}>
        <button onClick={() => setOpen((prev) => !prev)}>{">"}</button>
      </div>

      <section id="center">
        {message && <p>{message.message}</p>}
        <button onClick={() => hello()}>Send Help</button>

        <div className="TestNote"><Editor content={post} onChange={onChange}/></div>
      </section>
    </>
  );
}

export default App;
