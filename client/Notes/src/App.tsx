import { useState } from "react";
import "./App.css";

type HelloResponse = { message: string };

function App() {
  const [message, setMessage] = useState<HelloResponse | null>(null);
  const [panelState, setOpen] = useState<boolean>(false);

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
      <section className="sidePanel">
        <div className={`${panelState ? "red" : "blue"}`}></div>
        <button onClick={() => setOpen((prev) => !prev)}> <img src="favicon.svg" />
        </button>
      </section>
      

      <section id="center">
        {message && <p>{message.message}</p>}
        <button onClick={() => hello()}>Send Help</button>
      </section>
    </>
  );
}

export default App;
