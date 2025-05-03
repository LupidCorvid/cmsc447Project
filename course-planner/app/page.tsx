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


function Planner({ setSelectedCourse }: { setSelectedCourse: (course: DItemType) => void },
                  plannerCourses:DItemType[], {updatePlannerCourses}:{updatePlannerCourses:Function}, 
                  semesters:SemesterProps[], {updateSemesters}:{updateSemesters:Function}){
  
  const [userMajor, setValue] = useState("Undecided"); //The user's major
  
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
    

    //Only add a semester if it doesn't exist yet
    if(!semesters.find((e)=>
        {
            return e.name == semesterSeason + " " + yearInput;
        }))
    {
      updateSemesters(
        SortSemesters(
        [...semesters,
          {semester_id:newId, name: semesterSeason + " " + yearInput, courses:[]}
        ])
      )
    }
   
    //Update target semester year/season to be one next sequentially, skipping duplicates
    let Season = semesterSeason;
    let year = yearInput;
    do
    {
      switch (Season)
      {
        case "Fall":
          Season = "Spring";
          break;
        case "Spring":
          Season = "Fall";
          year++;
          break;
        case "Winter":
          Season = "Spring";
          year++;
          break;
        case "Summer":
          Season = "Fall";
          break;
      }
    }
    while(semesters.find((e)=>
      {
        return e.name == Season + " " + year;
      }) != undefined);
    setSeason(Season);
    setYearInput(year);
    
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

  function SortSemesters(target:SemesterProps[])
  {
    return target.sort((a:SemesterProps, b:SemesterProps) =>
    {
      var semA = a.name.split(" ");
      var semB = b.name.split(" ");
      console.log("Sorting " + semA[0] + " and " + semB[0]);
      if(semA[1] < semB[1])
        return -1;
      if (semA[1] > semB[1])
        return 1;
      
      return (seasonToInt(semB[0]) - seasonToInt(semA[0]));
    })
  }
  function seasonToInt(season:string)
  {
    switch(season)
    {
      case "Winter":
        return 0;
      case "Spring":
        return 1;
      case "Summer":
        return 2;
      case "Fall":
        return 3;
      default:
        return -1;
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
            callbackFunction={removeFromPlanner}
            setSelectedCourse={setSelectedCourse}/>
          )}
        <RenderSemester
          semester_id={0}
          name={"Past Courses"}
          courses={plannerCourses.filter((course:DItemType) => course.semester === 0)}
          key={0} 
          callbackFunction={removeFromPlanner}
          setSelectedCourse={setSelectedCourse}/>
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
    </div>
  )}
  


//TODO: Work In Progress
function CourseSearch({ setSelectedCourse }: { setSelectedCourse: (course: DItemType) => void }){
  //Debug: An array of DItems
  //const [searchItems, updateSearchItems] = useState<DItemType[]>([{id:"CMSC 331", semester: 1 },{id:"CMSC 341", semester: 1}, {id:"CMSC 304", semester: 1 }]); 
  const removeFromPlanner = () => {
    console.log("Does Nothing");
    // Your removal logic here
  };
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
        <Searchbar setSelectedCourse={setSelectedCourse} removeFromPlanner={removeFromPlanner}/>
        <div id="SearchbarSpot" style={{padding: '15px'}}> </div>
        {PopulateCourseSerach()}
      </div>
      </DndContext>
    </div>
  );
}
function CourseInfo({ course }: { course: DItemType | null }){
  const [prereqString, setString] = useState("");
  function prerequisiteString(){
    let finalString = "";
    let multDep = "";
    let multQuan = "";
    let multLevel = "";
    //And
    if(course === null){
      return;
    }
    for(let i = 0; i < course.prerequisites.length; i ++){
      const group = course.prerequisites[i];
    //Or
      for (let j = 0; j < group.length; j++) {
        const orGroup = group[j];
    //And
        for (let k = 0; k < orGroup.length; k++) {
          console.log(orGroup.length);
          if(orGroup.length > 1 && k == 0){
            finalString += "(";
          }
          if(k > 0){
            finalString += "and ";
          }
          //detect MLT
          if(orGroup[k].slice(0, 3) === "MLT"){
            multDep = orGroup[k].slice(3, 7);
            multLevel = orGroup[k].slice(7, 8);
            multQuan = orGroup[k].slice(8, 9);
            finalString += multQuan + " " + multLevel + "XX level " + multDep + " electives" 
          }else{
            finalString += orGroup[k];
          }
          if(orGroup.length > 1 && k == orGroup.length - 1){
            finalString += ")";
          }else{
            finalString += " ";
          }
        }
        if(group.length > 1 && j != group.length - 1){
          finalString += "or ";
        }
      }
      finalString += "with a C or better "
      if(course.prerequisites.length > 1 && i != course.prerequisites.length - 1){
        finalString += "and ";
      }
    }
    return finalString;
  }
  return (
    <div id="Course Info"  style={{
      position: 'absolute',
      top: 0,
      right:550,
      padding: '50px',
      paddingRight: '150px',
      width: '300px'
    }}>
      <h1 className={styles.headerStyle} style={{ float: 'left', paddingBottom: '95px' }}>
        Course Info
      </h1>
      <div className={styles.plannerStyle} style={{clear:'both', borderStyle: 'solid'}}>
        {course ? (
          <div>
            <p><strong>ID:</strong> {course.id}</p>
            <p><strong>Credits:</strong> {course.credits}</p>
            <p><strong>Prerequisties:</strong> {prerequisiteString()}</p>
            <p><strong>Course Description:</strong> {course.GeneralDescription}</p>
          </div>
          ) : (
          <p>Select a course to view info.</p>
          )}
        
          {/* Course info content goes here */}
        </div>

    </div>
  );
}

export default function App() {

  let mylist = [""];
  let majorList = [""];
  const classList = jsonContent.name;
  checkPrereq(classList, "CMSC 447", 3, mylist);
  checkMajor(classList, jsonContent.Majors.find((m)=>(m.name == "Computer Science"))?.prerequisites, 5000, majorList);

  const [plannerCourses, updatePlannerCourses] = useState<DItemType[]>(defaultItems); //List of all courses in the planner
  const [semesters, updateSemesters] = useState(defaultSemesters); //An array of semesters in the planner
  

  //needed for course info
  const [selectedCourse, setSelectedCourse] = useState<DItemType | null>(null);
  return (
    <html>
      <body>
        <div id="sidebar" className={styles.sidebarStyle}>
          <div className={styles.picture1}/> <br/> <hr/>
          <div className={styles.text1}>Major</div>
          <div className={styles.text1} style={{paddingTop:20, paddingBottom:20}}>Recommended Credits per Semester: XX</div>
          <div style={{textAlign: 'left'}}>
            <a className={styles.text2} href="https://apps.my.umbc.edu/pathways/">See four year pathways</a>
          </div>
        </div>


        <div style={{marginLeft:300}}>
            <DndContext>
              {Planner ({setSelectedCourse}, plannerCourses, {updatePlannerCourses},
                        semesters, {updateSemesters})}
              <div style={{marginLeft:600}}> <CourseSearch setSelectedCourse={setSelectedCourse}/></div>
              
            </DndContext>
            {/*<CourseInfo course={selectedCourse}/>*/}
          
        </div>
        

      </body>
    </html>
    
  );
  }

