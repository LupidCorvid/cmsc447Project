'use client';
import React, { useState,useEffect, InputHTMLAttributes } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';

import Searchbar from "./searchbar/src/components/Searchbar"
import styles from "./searchbar/src/components/page.module.css";
import {DItemType, SemesterProps, MajorProps} from './searchbar/src/components/types';
import { RenderSemester } from './searchbar/src/components/Semester';
import { renderToHTML } from 'next/dist/server/render';

import {checkPrereq, checkMajor, findIndexByID, checkMultiple, checkAllPrereqsUnmet} from "./searchbar/src/components/PrerequisiteCheck";
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

const majors: MajorProps[] = jsonContent.Majors;


function Planner(){
  const [semesters, updateSemesters] = useState(defaultSemesters); //An array of semesters in the planner
  const [userMajor, setValue] = useState("Undecided"); //The user's major
  const [plannerCourses, updatePlannerCourses] = useState<DItemType[]>(defaultItems); //List of all courses in the planner
  const [yearInput, setYearInput] = useState<number>(2024); //What year to add new semesters to
  const [semesterSeason, setSeason] = useState("Fall"); //What season the new semester is
  
  //store unmet prerequisites to display in error message
  const [unmetPrereqs, setUnmetPrereqs] = useState<string[]>([]);
  const [unmetMajorReqs, setUnmetMajorReqs] = useState<string[]>([]);
  
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
    console.log("Fired");
    const {active, over} = event; //active: The task we're actually dropping
                                  //over: if you are over something that is droppable
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
    //let newString = checkPrereq(plannerCourses, courseId, newSemester, unmetPrereqs, setUnmetPrereqs);
    //setUnmetPrereqs(newString)
    //console.log("64: ", newString)
    //check all other classes for prerequisites
    let newString = checkAllPrereqsUnmet(plannerCourses, courseId, newSemester, unmetPrereqs, setUnmetPrereqs);
    setUnmetPrereqs(newString);
    const tempList = unmetPrereqs.slice(1,2);
    setUnmetPrereqs(tempList);
    //console.log("68: ", newString)


    //Check for missing major requirements
    let majorList:String[] = [];
    if(userMajor != "Undecided")
      majorList = checkMajor(plannerCourses, jsonContent.Majors.find((m)=>(m.name == userMajor))?.prerequisites, 5000, majorList, courseId, newSemester == 0);
    let majorReqs = "";
    if(majorList.length > 0)
      majorReqs += "The following graduation requirements for your major are not met:\n";
    //majorList.forEach(element => {
    //  if(element != "")
    //    majorReqs += element + ", ";
    //});
    for(let i = 0; i < majorList.length; i++)
    {
      if(majorList[i].substring(0,3) == "MLT")
      {
        majorList[i] = majorList[i][8] + " " + majorList[i][7] + "00 " + " level " + majorList[i].substring(3, 7) + " classes";
      }
    };

    majorReqs += majorList.join(", ");


    if(majorList.length > 0)
    {
      setGradReqErrorMsg(majorReqs);
    }
    else
    {
      setGradReqErrorMsg("");
    }

    // Update error message based on unmet prereqs 
    setPrereqErrorMsg(() => {
      if (newString.length > 0) {
        return "The following courses do not meet prerequisites: " + newString.join(", ");
      }
      else{
        return "Empty";
      }
    });
  }

  function removeFromPlanner(courseId:string){
    console.log("removeFromPlanner triggered: ", courseId);
    //course.semester = -2; //Doesn't save to page.tsx
    //scanPlannerListForRemoval()
    let temp = -1;
    updatePlannerCourses(() =>
      plannerCourses.map((course: DItemType) =>
        course.id === courseId
          ? { ...course, semester: -2, credits: 3 }
          : course
      )
    )
    
    for (let i = 0; i < plannerCourses.length; i++){
      if (plannerCourses[i].id == courseId) temp = i
    }
    console.log("ID: ", temp)
  }

  //Adds a new semester
  function updateCoursesInSemester(){
    let newId = semesters.length + 1; //Must be 1 because semesters.length starts at 0
    let newName = "New semester " + (newId) //TODO: Let user name the semester
    //print semesters in order (does not include Past Semesters)
    //print past courses
    updateSemesters(
      [...semesters,
        {semester_id:newId, name: semesterSeason + " " + yearInput, courses:[]}
      ]
    )
    switch (semesterSeason)
    {
      case "Fall":
        setSeason("Spring");
        break;
      case "Spring":
        setSeason("Fall");
        setYearInput(yearInput + 1);
        break;
      case "Winter":
        setSeason("Spring");
        setYearInput(yearInput + 1);
        break;
      case "Summer":
        setSeason("Fall");
        break;
    }
    return 
  }

  //Checks the planner for courses of semester_id = -2 and removes them
  function scanPlannerListForRemoval() {

    for (let i = plannerCourses.length - 1; i >= 0; i--){ //let i = 0; i < plannerCourses.length; i++
      //Set a temp array to modify
      let tempArr = [...plannerCourses];
      let rerenderFlag = false;

      //If course has semester -2, remove it from temparr
      if (plannerCourses[i].semester === -2){
        rerenderFlag = true;
        console.log("Get rid of it");

        //Remove by making a copy and setting state array to the copy
        tempArr.splice(i, 1); //index, deleteCount
      }

      //Update the main array with temparr values
      if(rerenderFlag){
        updatePlannerCourses(
          [...tempArr]
        );
        rerenderFlag = false;
      }
    }
  }


  //Renders all of the semesters using a loop
  //Each semester renders the courses associated with it using the .filter() function
  //NOTE: The plannerScrollStyle overflow-x may cause issues with transferring from course search to planner
  function PopulatePlanner(){
    scanPlannerListForRemoval();
    return(
      <div className={styles.plannerScrollStyle}>
        <DndContext onDragEnd={handleDragEnd}>
        {semesters.map((semester) =>
          <RenderSemester 
            semester_id={semester.semester_id} 
            name={semester.name} 
            courses={plannerCourses.filter((course:DItemType) => course.semester === semester.semester_id)}
            key={semester.semester_id}
            callbackFunction={removeFromPlanner}/>
          )}
        <RenderSemester
          semester_id={0}
          name={"Past Courses"}
          courses={plannerCourses.filter((course:DItemType) => course.semester === 0)}
          key={0} 
          callbackFunction={removeFromPlanner}/>
        </DndContext>
      </div>
    );
  }
  
  //Updates the value of userMajor
  function UpdateMajor(event: React.ChangeEvent<HTMLSelectElement>){
    setValue(event.target.value);
    //Change prereqs
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


  function ChangeYear(e:any)
  {
    if(Number.parseInt(e.target.value))
      setYearInput(Number.parseInt(e.target.value));
    
  }

  function ChangeSeason(e:any)
  {
    setSeason(e.target.value);
  }

  return(
    <div>
      <DndContext onDragEnd={handleDragEnd}>
    <div key="Planner" style={{float: 'left'}}>

      <h1 className={styles.headerStyle} style={{float:'left'}}>
        My Planner
      </h1>

      <p id="Text Under Planner" className={styles.textStyle} style={{clear:'both', float:'left', textAlign:'left', lineHeight: 1.7}}>
        Major: &nbsp;

        <select id="Update Major Dropdown" value={userMajor} onChange={event => UpdateMajor(event)} className={styles.majorDecideStyle}>
        <option value={"Undecided"}>Undecided</option>
          {
            majors.map((major) =>
            <option value={major.name}>{major.name}</option>)
          }
        </select>

        <br/>

        Recommended Credits per Semester: {GetRecCredits()}
      </p>

      <div id="Planner Dynamic List" className={styles.plannerStyle} style={{clear:'both', float: 'left', borderStyle: 'solid'}}>
        <button id="New Semester Button" onClick={updateCoursesInSemester} className={styles.addSemBtnStyle}>Add new semester</button>
        <select id="Semester Season Dropdown" className={styles.semSeasonStyle} onChange={ChangeSeason} value={semesterSeason}>
        {/* TODO: Get dropdown to aligh nicely*/}
        <option value={"Fall"}>Fall</option>
        <option value={"Winter"}>Winter</option>
        <option value={"Spring"}>Spring</option>
        <option value={"Summer"}>Summer</option>
        </select>
        <input type="number"
        placeholder = "Year"
        value={yearInput}
        onChange={ChangeYear} className={styles.semYearStyle}></input>
        {PopulatePlanner()}
      </div>
      
      <div id="Notifications"  /*style={{clear:"left", lineHeight: 14}}*/>

        <p className={styles.notificationStyle}>{prereqErrorMsg}</p>
        <br/>
        <p className={styles.notificationStyle}>{gradreqErrorMsg}</p>
      </div>
    </div>
    </DndContext>
    </div>
  )}
  

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
    <div id="Course Search" style={{float: 'right', position: 'absolute', top:0, right:0, padding: '50px'}}>
      <DndContext>
      <h1 className={styles.headerStyle} style={{float:'left', paddingBottom: '95px'}}>
        Course Search
      </h1>

      <div id="Course Search Dynamic List" className={styles.plannerStyle} style={{clear:'both', float: 'right', borderStyle: 'solid'}}>
        <Searchbar/>
        <div id="SearchbarSpot" style={{padding: '15px'}}> </div>
        {PopulateCourseSerach()}
      </div>
      </DndContext>
    </div>
  );
}

export default function App() {

  let mylist = [""];
  const classList = jsonContent.name;
  checkPrereq(classList, "CMSC 447", 3, mylist);
  let majorList = [""];
  checkMajor(classList, jsonContent.Majors.find((m)=>(m.name == "Computer Science"))?.prerequisites, 5000, majorList);
  //console.log(jsonContent.Majors.find((m)=>(m.name == "Computer Science"))?.prerequisites);
  //console.log(majorList);
  return (
    <html>
      <body>
          <Planner/>
          <DndContext></DndContext>
        <CourseSearch/>

      </body>
    </html>
    
  );
  }

