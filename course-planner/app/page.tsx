'use client';
import React, { useState,useEffect } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import DynamicList from "./searchbar/src/components/DynamicList";
import Searchbar from "./searchbar/src/components/Searchbar"
import Droppable from "./searchbar/src/components/DragAndDropTest";

function Planner(){
  return(

  );
}

export default function App() {
  const [tester, settester] = useState(['MATH 221', 'CMSC 304', 'CMSC 447', 'STAT 355', 'PHYS 122'])
    return (
      <html>
        <body>
          <div className="App">
            <h1>Hello World!</h1>
            {/*<DynamicList elements={tester} setElements={settester} />*/}
            {/*<Droppable elements={tester} />*/}
          </div>
            <DndContext>
            </DndContext>
        </body>
      </html>
      
    );
  }