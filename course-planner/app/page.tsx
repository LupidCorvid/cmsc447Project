'use client';
import React, { useState,useEffect } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';

import Searchbar from "./searchbar/src/components/Searchbar"
import styles from "./searchbar/src/components/page.module.css";
import {DItemType, PlannerProps, CourseSearchProps, SemesterProps} from './searchbar/src/components/types';
import { RenderSemester } from './searchbar/src/components/Semester';

const defaultItems: DItemType[] = [
  {id:"CMSC 201", semester: 1},
]
const defaultSemesters: SemesterProps[] = [
  {semester_id:1, name: "Fall 2022", courses:defaultItems},
  {semester_id:2, name: "Spring 2023",  courses:[]}
]

function Planner(){
  const [semesters, setSemesters] = useState(defaultSemesters); //An array of semesters in the planner
  const [userMajor, setValue] = useState("Undecided"); //The user's major
  var recCredits = 0;

  function handleDragEnd(event: DragEndEvent){
    console.log("Fired handleDragEnd")
    const {active, over} = event; //active: The task we're actually dropping
                                  //over: if you are over something that is droppable
    if (!over) {
      console.log("Not over")
      return;
    }
    const courseId = active.id as string; //Must typecast this
    const newSemester = over.id as DItemType['semester'] //The column id, so the semester id

    console.log("overID:", over.id)
    console.log("activeID: ", active.id)
    
    //This is the updater function of the state array tester
    //Finds the course we just dragged in the list of courses and updates the semester
    updatePlannerCourses(()=>
      plannerCourses.map((course:DItemType) =>
      
        (course.id === courseId) ? {
          id: course.id,
          semester: newSemester
        } : course,
      ),
    );
    console.log(plannerCourses)
  }

  //Render all of the semesters
  function PopulatePlanner(){
    return(
      <div>
        <DndContext onDragEnd={handleDragEnd}>
        {semesters.map((semester) =>
          <RenderSemester 
            semester_id={semester.semester_id} 
            name={semester.name} 
            courses={semester.courses.filter((course:DItemType) => course.semester === semester.semester_id)}/>
          )}
        </DndContext>
      </div>
    );
  }
  
  function UpdateMajor(event: React.ChangeEvent<HTMLSelectElement>){
    setValue(event.target.value);
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

        Recommended Credits per Semester: {recCredits}
      </p>

      <div id="Planner Dynamic List" className={styles.plannerStyle} style={{clear:'both', float: 'left', borderStyle: 'solid'}}>
        {PopulatePlanner()}
      </div>

      <div id="Notifications"  style={{clear:"left", lineHeight: .1}}>
        <p className={styles.notificationStyle}>*The following courses in your planner do not meet prerequisite requirements:</p>
        <br/>
        <p className={styles.notificationStyle}>*This plan does not meet graduation requirements for {userMajor}</p>
      </div>
    </div>
  );
}

function CourseSearch(){
  const [searchItems, updateSearchItems] = useState<DItemType[]>([{id:"CMSC 331", semester: 1 },{id:"CMSC 341", semester: 1}, {id:"CMSC 304", semester: 1 }]); //An array of DItems

  const tester = ["CMSC 331", "CMSC 341", "CMSC 304"]; //Stuff to fill the state array with. Replace with database info later

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
  const [plannerCourses, updatePlannerCourses] = useState<DItemType[]>(defaultItems); //List of all courses in the planner
  return (
    <html>
      <body>
          <Planner/>
          <CourseSearch/>
          <DndContext></DndContext>
      </body>
    </html>
    
  );
  }