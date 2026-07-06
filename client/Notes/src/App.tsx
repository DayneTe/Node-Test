'use client'
import { useState } from "react";
import "./App.css";
import Editor from "./components/editor";
import Moveable from 'react-moveable'
import React from "react";

function App() {
  const [panelState, setOpen] = useState<boolean>(false);
  const [post, setPost] = useState("");
  const targetRef = React.useRef<HTMLDivElement>(null);

  const onChange = (content: string) => {
    setPost(content)
    console.log(content)
  }

  return (
    <>
      <section className={`sidePanel ${panelState ? "sidePanel--open" : ""}`}>
        <button
          className={`${panelState ? "sidePanelButton " : "sidePanelButton--hidden"} `}
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

        <div className="TestNote" ref={targetRef}><Editor content={post} onChange={onChange} /></div>
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
          onResize={e => {
            e.target.style.width = `${e.width}px`
            e.target.style.height = `${e.height}px`
            e.target.style.transform = `${e.drag.transform}`
          }}
          onDrag={e => {
            e.target.style.transform = e.transform;
          }}
        />

      </section>
    </>
  );
}

export default App;
