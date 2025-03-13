'use client';
import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import DynamicList from "./searchbar/src/components/DynamicList";
import styles from "./searchbar/src/components/page.module.css";

//<div ref={setNodeRef} {...listeners} {...attributes} style = {style}>

/*const DItem = () => {
    const {attributes, listeners, setNodeRef, transform} = useDraggable(
        {id: 'draggable-item',}
    );
    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className={styles.draggableStyle}>
            item!
        </div>
    )
}

<DndContext>
    <DItem/>
</DndContext>    
*/
//<DynamicList elements={tester} listId="2" style={{float: 'right'}}/>
function App() {
  const tester = ["A", "B", "C"];
    return (
      <html>
        <body>
          <div className="App">
            
            <div style={{clear: 'both'}}>
              <h1 className={styles.headerStyle} style={{float: 'left'}}>My Planner</h1>
              <h1 className={styles.headerStyle} style={{float: 'right'}}>Course Search</h1>
            </div>

            <div style={{clear: 'both'}}>
              <div className={styles.plannerStyle} style={{float: 'left'}}>
                <DynamicList elements={tester} listId="1"/>
              </div>

              <div className={styles.plannerStyle} style={{float: 'right'}}>
                <p>Search for a class</p>
              </div>

            </div>

          </div>
        </body>
      </html>
      
    );
  }
  export default App;