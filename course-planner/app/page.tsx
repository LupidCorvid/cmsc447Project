'use client';
import React, { useState,useEffect } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';

import Searchbar from "./searchbar/src/components/Searchbar"
import styles from "./searchbar/src/components/page.module.css";
import {DItemType, SemesterProps} from './searchbar/src/components/types';
import { RenderSemester } from './searchbar/src/components/Semester';
import {checkPrereq, findIndexByID, checkMultiple, checkAllPrereqsUnmet} from "./searchbar/src/components/PrerequisiteCheck";
import jsonContent from "./searchbar/src/components/test.json";

//Debug Draggable items
const defaultItems: DItemType[] = jsonContent.name;
//Debug Semesters
const defaultSemesters: SemesterProps[] = [
]
//Past courses semester
const pastCoursesSem: SemesterProps[] = [
  {semester_id:0, name: "Past Courses", courses:defaultItems}
]

function Planner(){
  const [semesters, updateSemesters] = useState(defaultSemesters); //An array of semesters in the planner
  const [userMajor, setValue] = useState("Undecided"); //The user's major
  const [plannerCourses, updatePlannerCourses] = useState<DItemType[]>(defaultItems); //List of all courses in the planner
  //store unmet prerequisites to display in error message
  const [unmetPrereqs, setUnmetPrereqs] = useState<string[]>([]);
  
  //TODO: Implement prereq checking and then enable these variables
  const [prereqErrorMsg, setPrereqErrorMsg] = useState("");// "*The following courses in your planner do not meet prerequisite requirements:";
  const [gradreqErrorMsg, setGradReqErrorMsg] = useState("");//"*This plan does not meet graduation requirements for " + userMajor;

  //used to fix updating bugs
  const [lastDraggedCourseId, setLastDraggedCourseId] = useState<string | null>(null);
  const [lastDraggedSemester, setLastDraggedSemester] = useState<number | null>(null);
  
  //Handles when the user lets go of a dragged object
  //Checks if the final spot was in a semester and updates the item accordingly
      //setUnmetPrereqs([]);
  function handleDragEnd(event: DragEndEvent){
    const {active, over} = event; //active: The task we're actually dropping
                                  //over: if you are over something that is droppable
    //console.log("hit");
    if (!over) {
      return;
    }
    const courseId = active.id as string; //Note: Must typecast this
    const newSemester = over.id as DItemType['semester'] //Note: The column id, so the semester id
    
    //Updater function for plannerCourses
    //Finds the course we just dragged in the list of courses and updates its semester property
    updatePlannerCourses(() =>
      plannerCourses.map((course: DItemType) =>
        course.id === courseId
          ? { ...course, semester: newSemester, credits: 3 }
          : course
      )
    );
    setLastDraggedCourseId(courseId);
    setLastDraggedSemester(newSemester);
    // Run prereq check using the updated course list
    let newString = checkPrereq(plannerCourses, courseId, newSemester, unmetPrereqs, setUnmetPrereqs);
    //setUnmetPrereqs(newString)
    console.log("64: ", newString)
    //check all other classes for prerequisites
    newString = checkAllPrereqsUnmet(plannerCourses, newString, setUnmetPrereqs, courseId, newSemester);
    setUnmetPrereqs(newString);
    console.log("68: ", newString)
    // Update error message based on unmet prereqs 
    setPrereqErrorMsg(() => {
      if (newString.length > 0) {
        return "The following courses do not meet prerequisites: " + newString.join(", ");
      } else {
        return "Empty";
      }
    });

  }

  //Adds a new semester
  function updateCoursesInSemester(){
    let newId = semesters.length + 1; //Must be 1 because semesters.length starts at 0
    let newName = "New semester " + (newId) //TODO: Let user name the semester
    //print semesters in order (does not include Past Semesters)
    //print past courses
    updateSemesters(
      [...semesters,
        {semester_id:newId, name: newName, courses:[]}
      ]
    )
    return 
  }

  //Renders all of the semesters using a loop
  //Each semester renders the courses associated with it using the .filter() function
  //TODO: The plannerScrollStyle overflow-x may cause issues with transferring from course search to planner
  function PopulatePlanner(){
    return(
      <div className={styles.plannerScrollStyle}>
        <DndContext onDragEnd={handleDragEnd}>
        {semesters.map((semester) =>
          <RenderSemester 
            semester_id={semester.semester_id} 
            name={semester.name} 
            courses={plannerCourses.filter((course:DItemType) => course.semester === semester.semester_id)}
            key={semester.semester_id}/>
          )}
        <RenderSemester
          semester_id={0}
          name={"Past Courses"}
          courses={plannerCourses.filter((course:DItemType) => course.semester === 0)}
          key={0} />
        </DndContext>
      </div>
    );
  }
  
  //Updates the value of userMajor
  function UpdateMajor(event: React.ChangeEvent<HTMLSelectElement>){
    setValue(event.target.value);
  }

  function GetRecCredits()
  {
    if(semesters.length > 0)
    {
      var takenCredits = 0;
      plannerCourses.filter((course:DItemType) => course.semester === 0).forEach(element =>
        takenCredits += element.credits
      );
      return Math.ceil(((120 - takenCredits)/semesters.length));
    }
    return 0
  }

  return(
    <div key="Planner" style={{float: 'left'}}>

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

        Recommended Credits per Semester: {GetRecCredits()}
      </p>

      <div id="Planner Dynamic List" className={styles.plannerStyle} style={{clear:'both', float: 'left', borderStyle: 'solid'}}>
        <button id="New Semester Button" onClick={updateCoursesInSemester} className={styles.addSemBtnStyle}>Add new semester</button>
        {PopulatePlanner()}
      </div>

      <div id="Notifications"  style={{clear:"left", lineHeight: .1}}>
        <p className={styles.notificationStyle}>{prereqErrorMsg}</p>
        <br/>
        <p className={styles.notificationStyle}>{gradreqErrorMsg}</p>
      </div>
    </div>
  );
}

//TODO: Work In Progress
function CourseSearch(){
  //Debug: An array of DItems
  //const [searchItems, updateSearchItems] = useState<DItemType[]>([{id:"CMSC 331", semester: 1 },{id:"CMSC 341", semester: 1}, {id:"CMSC 304", semester: 1 }]); 

  const tester = ["CMSC 331", "CMSC 341", "CMSC 304"]; //Stuff to fill the state array with. Replace with database info later

   //TODO: Implement
   //Where all of the courses will go
   function PopulateCourseSerach(){
      return(
        <div>
          {/*searchItems.map((item) => 
              <RenderDItem {...item} key={item.id}/>
            )*/}
        </div>
      );
    }

  return(
    <div id="Course Search" style={{float: 'right'}}>

      <h1 className={styles.headerStyle} style={{float:'left', paddingBottom: '95px'}}>
        Course Search
      </h1>

      <div id="Course Search Dynamic List" className={styles.plannerStyle} style={{clear:'both', float: 'right', borderStyle: 'solid'}}>
        <div id="SearchbarSpot" style={{padding: '15px'}}> </div>
        {PopulateCourseSerach()}
      </div>

    </div>
  );
}


export default function App() {
  return (
    <html>
      <body>
          <Planner/>
          <CourseSearch/>
      </body>
    </html>
    
  );
  }