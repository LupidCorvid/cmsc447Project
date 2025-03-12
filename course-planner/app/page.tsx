'use client';
import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import DynamicList from "./searchbar/src/components/DynamicList";

const DItem = () => {
    const {attributes, listeners, setNodeRef, transform} = useDraggable(
        {id: 'draggable-item',}
    );
    const style = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : '',
        padding: '20px',
        backgroundColor: 'lightblue',
        cursor: 'grab',
        width: '100px',
        textAlign: 'center',
    }
    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style = {style}>
            item
        </div>
    )
}

function App() {
  const tester = ["A", "B", "C"];
    return (
      <html>
        <body>
          <div className="App">
            <h1>Hello World!</h1>
            <a
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read our docs
            </a>
            <DynamicList elements={tester} listId="1"/>
            <DynamicList elements={tester} listId="2"/>
          </div>
            <DndContext>
                <DItem/>
            </DndContext>
        </body>
      </html>
      
    );
  }
  export default App;