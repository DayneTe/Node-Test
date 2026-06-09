import { useState } from "react";
import "./App.css";

type HelloResponse = { message: string };

function App() {
  const [message, setMessage] = useState<HelloResponse | null>(null);

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
      <div className="sidePanel">f</div>

      <section id="center">
        {message && <p>{message.message}</p>}
        <button onClick={() => hello()}>Send Help</button>
      </section>
    </>
  );
}

export default App;
