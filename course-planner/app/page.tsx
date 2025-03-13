'use client';
import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import DynamicList from "./searchbar/src/components/DynamicList";
import Searchbar from "./searchbar/src/components/Searchbar"
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

Major: {userMajor} &nbsp;
                  <a href="">(change)</a>



*/

function App() {
  const tester = ["CMSC 201", "CMSC 202", "CMSC 203"];
  const tester2 = ["CMSC 331", "CMSC 341", "CMSC 304"];
  var userMajor = "Undecided";
  var recCredits = 0;
    return (
      <html>
        <body>
          <div className="App">

            <div style={{clear: 'both'}}>
              
              <div id="Planner" style={{float: 'left'}}>
                <h1 className={styles.headerStyle} style={{float:'left'}}>My Planner</h1>
                <p className={styles.textStyle} style={{clear:'both', float:'left', textAlign:'left', lineHeight: 1.7}}>
                  Major: &nbsp;
                  <select name="majors" id="majors" className={styles.majorDecideStyle}>
                    <option value="IDK">Undecided</option>
                    <option value="CMSC">Computer Science</option>
                    <option value="CMPE">Computer Engineering</option>
                    <option value="IS">Information Systems</option>
                  </select>
                  <br/>
                  Recommended Credits per Semester: &nbsp; {recCredits}
                </p>

                <div className={styles.plannerStyle} style={{clear:'both', float: 'left', borderStyle: 'solid'}}>
                  <DynamicList elements={tester} listId="1"/>
                </div>
              </div>

              <div id="Course Search" style={{float: 'right'}}>

                <h1 className={styles.headerStyle} style={{float:'left', paddingBottom: '55px'}}>Course Search</h1>

                <div className={styles.plannerStyle} style={{clear:'both', float: 'right', borderStyle: 'solid'}}>
                  <div style={{padding: '15px'}}> <Searchbar/> </div>
                  <DynamicList elements={tester2} listId="2"/>
                </div>

              </div>
            
            </div>

          </div>
        </body>
      </html>
      
    );
  }
  export default App;