'use client';
import React, { useState,useEffect } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
//import DynamicList from "./searchbar/src/components/DynamicList";
import Searchbar from "./searchbar/src/components/Searchbar"
import Droppable from "./searchbar/src/components/DragAndDropTest";
import styles from "./searchbar/src/components/page.module.css";
import RenderDItem from "./searchbar/src/components/DItem";

//In order to use DItems as a state array, it needs to be a tyescript struct here
type DItemType = {
  id: string;
  semester: number; //0 = course search
}
type PlannerProps = {
  id: string;
  numSemesters: number;
  courses: DItemType[];
}
type CourseSearchProps = {
  id: string;
  courses: DItemType[];
}
type SemesterProps = {
  id: number;
  name: string;
  courses: DItemType[];
}

const defaultItems: DItemType[] = [
  {id:"CMSC 201", semester: 1},
]
const defaultSemesters: SemesterProps[] = [
  {id:1, name: "Fall 2022", courses:defaultItems},
  {id:2, name: "Spring 2023",  courses:[]}
]

/*
  {id:"CMSC 202", semester: 1}, 
  {id:"CMSC 203", semester: 1}
*/

function Planner(){
  const [semesters, setSemesters] = useState(defaultSemesters); //An array of semesters in the planner
  const [userMajor, setValue] = useState("Undecided"); //The user's major
  var recCredits = 0;

  const [plannerCourses, updatePlannerCourses] = useState<DItemType[]>(defaultItems); //List of all courses in the planner
  function handleDragEnd(event: DragEndEvent){
    console.log("Fired handleDragEnd")
    const {active, over} = event; //active: The task we're actually dropping
                                  //over: if you are over something that is droppable
    if (!over) return;
    const courseId = active.id as string; //Must typecast this
    const newSemester = over.id as DItemType['semester'] //The column id, so the semester id

    console.log(courseId)
    console.log(newSemester)
    
    //This is the updater function of the state array tester
    //Takes all of the tasks, and ONLY in the one that is equal to the one that is currently active, 
    //we give it a new status (semester) and update the state
    updatePlannerCourses(()=>
      plannerCourses.map((course) =>
        (course.id === courseId) ? {
          ...course,
          semester: newSemester
        } : course,
      ),
    );
  }

  //Render all of the semesters
  //Functionality:
        //For i in range numSemesters
          //Render a semester object
          //For every class in semester
              //Render class object
  function PopulatePlanner(){

    //Renders each course that belongs to the semester
    function RenderSemester(semester: SemesterProps, courses:DItemType[]){
      console.log("Rendered semester")
      //setNodeRef: a reference to the div that we want to apply this to
      //useDroppable: DnD kit hook that marks a section as a drop zone. Defines the ID for the drop zone
      const { setNodeRef } = useDroppable({id: semester.id }); //Makes it so that the semester is a drop zone

      return(
        //setNodeRef: a marker so that useDroppable knows to apply its functionality to this specific div
        <div ref={setNodeRef} className ={styles.dropZoneStyle} key={semester.id}>
          {semester.courses.map((course) =>
            <RenderDItem {...course} key={course.id} />
          )}
        </div>
      );
    }

    return(
      <div>
        <DndContext onDragEnd={handleDragEnd}>
        {semesters.map((semester) =>
          RenderSemester({...semester}, semester.courses.filter((course:DItemType) => course.semester === semester.id))
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
        {searchItems.map((item) => 
            <RenderDItem {...item} key={item.id}/>
          )}
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
  //const [tester, setCourses] = useState<DItemType[]>(defaultItems)
  /* const [plannerCourses, updatePlannerCourses] = useState<DItemType[]>(defaultItems); //List of all courses in the planner
  function handleDragEnd(event: DragEndEvent){
    console.log("Fired handleDragEnd")
    const {active, over} = event; //active: The task we're actually dropping
                                  //over: if you are over something that is droppable
    if (!over) return;
    const courseId = active.id as string; //Must typecast this
    const newSemester = over.id as DItemType['semester'] //The column id, so the semester id

    console.log(courseId)
    console.log(newSemester)
    
    //This is the updater function of the state array tester
    //Takes all of the tasks, and ONLY in the one that is equal to the one that is currently active, 
    //we give it a new status (semester) and update the state
    updatePlannerCourses(()=>
      plannerCourses.map((course) =>
        (course.id === courseId) ? {
          ...course,
          semester: newSemester
        } : course
      )
    );
  } */

  return (
    <html>
      <body>
        
          <Planner/>
          <CourseSearch/>
      </body>
    </html>
    
  );
  }