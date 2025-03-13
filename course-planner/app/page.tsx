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
  const [userMajor, setValue] = useState("Undecided"); //A state variable
                                                       //The value userMajor is stored and can be used wherever needed
  
  const tester = ["CMSC 201", "CMSC 202", "CMSC 203"];
  const tester2 = ["CMSC 331", "CMSC 341", "CMSC 304"];
  var recCredits = 0;

  function UpdateMajor(event: React.ChangeEvent<HTMLSelectElement>){
    setValue(event.target.value);
  }

    return (
      <html>
        <body>
          <div className="App">

            <div id="Three Boxes" style={{clear: 'both'}}>
              
              <div id="Planner" style={{float: 'left'}}>

                <h1 className={styles.headerStyle} style={{float:'left'}}>
                  My Planner
                </h1>

                <p id="Text Under Planner" className={styles.textStyle} style={{clear:'both', float:'left', textAlign:'left', lineHeight: 1.7}}>
                  Major: &nbsp;

                  <select id="Update Major Dropdown" value={userMajor} onChange={event => UpdateMajor(event)} className={styles.majorDecideStyle}>
                    <option value={"Undecided"}>Undecided</option>
                    <option value={"Computer Science"}>Computer Science</option>
                    <option value={"Computer Engineering"}>Computer Engineering</option>
                    <option value={"Information Systems"}>Information Systems</option>
                  </select>

                  <br/>

                  Recommended Credits per Semester: {recCredits}
                </p>

                <div id="Planner Dynamic List" className={styles.plannerStyle} style={{clear:'both', float: 'left', borderStyle: 'solid'}}>
                  <DynamicList elements={tester} listId="1"/>
                </div>

                <div id="Notifications"  style={{clear:"left", lineHeight: .1}}>
                  <p className={styles.notificationStyle}>*The following courses in your planner do not meet prerequisite requirements:</p>
                  <br/>
                  <p className={styles.notificationStyle}>*This plan does not meet graduation requirements for {userMajor}</p>
                </div>
              </div>

              <div id="Course Search" style={{float: 'right'}}>

                <h1 className={styles.headerStyle} style={{float:'left', paddingBottom: '95px'}}>
                  Course Search
                </h1>

                <div id="Course Search Dynamic List" className={styles.plannerStyle} style={{clear:'both', float: 'right', borderStyle: 'solid'}}>
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