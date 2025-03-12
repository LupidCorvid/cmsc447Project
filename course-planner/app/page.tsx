'use client';
import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import DynamicList from "./searchbar/src/components/DynamicList";
import styles from "./searchbar/src/components/page.module.css";

//<div ref={setNodeRef} {...listeners} {...attributes} style = {style}>

const DItem = () => {
    const {attributes, listeners, setNodeRef, transform} = useDraggable(
        {id: 'draggable-item',}
    );
    /*const style = {
        //transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : '',
        padding: '20px',
        backgroundColor: 'lightblue',
        cursor: 'grab',
        width: '100px',
        textAlign: 'center',
    }*/
    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className={styles.draggableStyle}>
            item!
        </div>
    )
}

function App() {
  const tester = ["A", "B", "C"];
    return (
      <html>
        <body>
          <div className="App">
            <h1 className={styles.headerStyle}>My Planner</h1>
            
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