'use client';
import React, { useState,useEffect } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import DynamicList from "./searchbar/src/components/DynamicList";
import Searchbar from "./searchbar/src/components/Searchbar"
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
  const [tester, settester] = useState([])

  //Idea: 2D list for semesters that will add a new list for each semester
  const [semesters, updateSemesters] = useState([['MATH 221', 'CMSC 304']]);
  const myList = ['a', 'b']

  function addSemester(){
    //updateSemesters(semesters => semesters.push([]));
    myList.push('c')
  }
  useEffect(() => {
    settester(['MATH 221', 'CMSC 304', 'CMSC 447', 'STAT 355', 'PHYS 122']);
  }, []);
    return (
      <html>
        <body>
          <button onClick ={addSemester}>Click me</button>

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
            <DynamicList elements={tester} setElements={settester} />
          </div>
            <DndContext>
            </DndContext>
        </body>
      </html>
      
    );
  }
  export default App;