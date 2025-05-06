'use client';
import React, { useState,useEffect, InputHTMLAttributes, act } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable, closestCorners, DragOverlay, DragStartEvent } from '@dnd-kit/core';

import Searchbar from "./searchbar/src/components/Searchbar"
import styles from "./searchbar/src/components/page.module.css";
import {DItemType, SemesterProps, MajorProps, PublicNote} from './searchbar/src/components/types';
import { RenderSemester } from './searchbar/src/components/Semester';
import { renderToHTML } from 'next/dist/server/render';

import {checkPrereq, checkMajor, findIndexByID, checkMultiple, checkAllPrereqsUnmet} from "./searchbar/src/components/PrerequisiteCheck";
import jsonContent from "./searchbar/src/components/test.json";
import {NotesMenu} from "./NotesPage.page"
import { RenderDItem } from './searchbar/src/components/DItem';

const defaultItems: DItemType[] = [];

const defaultSemesters: SemesterProps[] = [
]

const pastCoursesSem: SemesterProps[] = [
  {semester_id:0, name: "Past Courses", courses:defaultItems}
]

const majors: MajorProps[] = jsonContent.Majors;

function Planner({ setSelectedCourse }: { setSelectedCourse: (course: DItemType) => void },
                  plannerCourses:DItemType[], {updatePlannerCourses}:{updatePlannerCourses:Function}, 
                  semesters:SemesterProps[], {updateSemesters}:{updateSemesters:Function},
                  masterList:DItemType[], {setMasterList}:{setMasterList:Function},
                  prereqErrorMsg:string, {setPrereqErrorMsg}:{setPrereqErrorMsg:Function},
                  unmetPrereqs:string[], {setUnmetPrereqs}:{setUnmetPrereqs:Function},
                  {CheckSemesterCredits2}:{CheckSemesterCredits2: Function}, creditErrorMsg:string, {setCreditErrorMsg}:{setCreditErrorMsg:Function}
                ){  //,event:(DragEndEvent | null)
  
  const [yearInput, setYearInput] = useState<number>(2024); //What year to add new semesters to
  const [semesterSeason, setSeason] = useState("Fall"); //What season the new semester is
  
  function removeFromPlanner(courseId:string){
    //console.log("removeFromPlanner triggered: ", courseId);
    //course.semester = -2; //Doesn't save to page.tsx
    //scanPlannerListForRemoval()
    let temp = -1;
    updatePlannerCourses(() =>
      plannerCourses.map((course: DItemType) =>
        course.id === courseId
          ? { ...course, semester: -1}
          : course
      )
    )
    setMasterList(() =>
      masterList.map((course: DItemType) =>
        course.id === courseId ? {...course, semester: -1}: course
      )
    )
    for (let i = 0; i < plannerCourses.length; i++){
      if (plannerCourses[i].id == courseId) temp = i
    }
    let newString = checkAllPrereqsUnmet(masterList, courseId, -1, unmetPrereqs, setUnmetPrereqs);
      setUnmetPrereqs(newString);
      const tempList = unmetPrereqs.slice(1,2);
      setUnmetPrereqs(tempList);
      setPrereqErrorMsg(() => {
        if (newString.length > 0) {
          return "The following courses do not meet prerequisites: " + newString.join(", ");
        }
        else{
          return "Empty";
        }
      });
      CheckSemesterCredits2(courseId, masterList[findIndexByID(courseId, masterList)].credits, -1);
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
          year++;
          break;
        case "Spring":
          Season = "Fall";
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

  //Checks the planner for courses of semester_id = -1 and removes them
  function scanPlannerListForRemoval() {

    for (let i = plannerCourses.length - 1; i >= 0; i--){ //let i = 0; i < plannerCourses.length; i++
      //Set a temp array to modify
      let tempArr = [...plannerCourses];
      let rerenderFlag = false;

      //If course has semester -1, remove it from temparr
      if (plannerCourses[i].semester === -1){
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
      //console.log("Sorting " + semA[0] + " and " + semB[0]);
      if(Number.parseInt(semA[1]) < Number.parseInt(semB[1]))
        return -1;
      if (Number.parseInt(semA[1]) > Number.parseInt(semB[1]))
        return 1;
      
      return (seasonToInt(semA[0]) - seasonToInt(semB[0]));
    })
  }

  function RemoveSemester(target:number)
  {
      let tempCreditString = creditErrorMsg;
      tempCreditString = tempCreditString.replace(semesters[target - 1].name, "");
      tempCreditString = tempCreditString.replace(semesters[target - 1].name + ", ", "");
      setCreditErrorMsg(() =>
      {
        if(tempCreditString === "Semesters have too many credits "){
          return "";
        }else{
          return tempCreditString;
        }
      }
      )
      updateSemesters(semesters.filter((e)=>
      {
        return e.semester_id != target
      }))
      updatePlannerCourses(plannerCourses.filter((e) =>
      {
        return e.semester != target;
      }))
      setMasterList(() =>
        masterList.map((e) =>
          e.semester === target ? {...e, semester: -1}: e
        ),
      )
      let newString = checkAllPrereqsUnmet(masterList, masterList[0].id, masterList[0].semester, unmetPrereqs, setUnmetPrereqs);
      setUnmetPrereqs(newString);
      const tempList = unmetPrereqs.slice(1,2);
      setUnmetPrereqs(tempList);
      masterList.map((e)=>
        {if(e.semester == target){
          console.log(newString[0])
          newString[0] = newString[0].replace(e.id + ",", "")
          newString[0] = newString[0].replace(e.id, "")
          for(let m = 0; m < newString.length; m++){
            //console.log(".",e.id,".",newString[m],".")
            
          }
        }}
      )
      console.log(newString)
      setPrereqErrorMsg(() => {
        if (newString.length > 0) {
          return "The following courses do not meet prerequisites: " + newString.join(", ");
        }
        else{
          return "Empty";
        }
      });

      
      
        //if course semester = target set seemster to -1
      
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

  //Renders all of the semesters using a map loop and filters the courses per semester using .filter()
  function PopulatePlanner(){
    scanPlannerListForRemoval();
    return(
      <div className={styles.plannerScrollStyle}>
        {semesters.map((semester) =>
          <RenderSemester 
            semester_id={semester.semester_id} 
            name={semester.name} 
            courses={plannerCourses.filter((course:DItemType) => course.semester === semester.semester_id)}
            key={semester.semester_id}
            callbackFunction={removeFromPlanner}
            setSelectedCourse={setSelectedCourse}
            removeSemCallback={RemoveSemester}/>
          )}
        <RenderSemester
          semester_id={0}
          name={"Past Courses"}
          courses={plannerCourses.filter((course:DItemType) => course.semester === 0)}
          key={0} 
          callbackFunction={removeFromPlanner}
          setSelectedCourse={setSelectedCourse}
          removeSemCallback={RemoveSemester}/>
      </div>
    );
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

      <h1 className={styles.headerStyle} style={{float:'left', paddingLeft:20}}>
        My Planner
      </h1>


      <div id="Planner Dynamic List" className={styles.plannerStyle} style={{clear:'both', float: 'left', paddingLeft:10}}>
        <div  style={{paddingLeft:10}}>
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
          <button id="New Semester Button" onClick={updateCoursesInSemester} className={styles.addSemBtnStyle}>Create semester</button>
        </div>
        {PopulatePlanner()}
        
      </div>
    </div>
    </div>
  )
}
  
function CourseSearch({ setSelectedCourse }: { setSelectedCourse: (course: DItemType) => void }, masterList:DItemType[]){
  
  //TODO: Possibly not needed?
  const removeFromPlanner = () => {
    console.log("Does Nothing");
    // Your removal logic here
    
  };

  return(
    <div id="Course Search" style={{float:'left', marginLeft:15, paddingBottom: 15}}>
      <h1 className={styles.headerStyle} style={{float:'left'}}>
        Course Search
      </h1>

      <div id="Course Search Dynamic List" className={styles.courseSearchStyle} style={{clear:'both', float: 'right'}}>
        <Searchbar setSelectedCourse={setSelectedCourse} removeFromPlanner={removeFromPlanner} masterList={masterList}/>
        <div id="SearchbarSpot" style={{padding: '15px'}}> </div>
      </div>
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
          //console.log(orGroup.length);
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
    <div id="Course Information" style={{float:'left', marginLeft:5}}>
      <h1 className={styles.infoHeaderStyle} style={{float: 'left', fontFamily: "Helvetica", fontWeight: 450,  paddingLeft:15}}>
        Course Information
      </h1>
      <hr style={{clear:'both'}}/>
      <div className={styles.courseInfoStyle} style={{clear:'both', float: 'right'}}>
        {course ? (
          <div className={styles.courseInfoScrollStyle}>
            <p><strong>ID:</strong> {course.id}</p>
            <p><strong>Credits:</strong> {course.credits}</p>
            <p><strong>Prerequisties:</strong> {prerequisiteString()}</p>
            <p><strong>Course Description:</strong> {course.GeneralDescription}</p>
          </div>
          ) : (
          <p className={styles.textFont} style={{float:'left', marginLeft:190, marginTop: 50, textAlign:'center', color:'gray'}}>Select a course to view info</p>
          )}
        </div>

    </div>
  );
}

let notesOpen = false;
export default function App() {

  let mylist = [""];
  let majorList = [""];
  const classList = jsonContent.name;
  checkPrereq(classList, "CMSC 447", 3, mylist);
  checkMajor(classList, jsonContent.Majors.find((m)=>(m.name == "Computer Science"))?.prerequisites, 5000, majorList);
  
  //Note popup functionality
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)
  function openNotes()
  {
    notesOpen = true;
    forceUpdate();
  }
  function closeNotes()
  {
    notesOpen = false;
    forceUpdate();
  }
  //stores all classes and their current states
  const[masterList, setMasterList] = useState<DItemType[]>(jsonContent.name);

  const [plannerCourses, updatePlannerCourses] = useState<DItemType[]>([]); //List of all courses in the planner
  const [semesters, updateSemesters] = useState(defaultSemesters); //An array of semesters in the planner
  const [selectedCourse, setSelectedCourse] = useState<DItemType | null>(null); //needed for course info

  //used to fix updating bugs
  const [lastDraggedCourseId, setLastDraggedCourseId] = useState<string | null>(null);
  const [lastDraggedSemester, setLastDraggedSemester] = useState<number | null>(null);

  //store unmet prerequisites to display in error message
  const [unmetPrereqs, setUnmetPrereqs] = useState<string[]>([]);
  const [unmetMajorReqs, setUnmetMajorReqs] = useState<string[]>([]);
  
  //The strings holding the prereq error messages
  const [prereqErrorMsg, setPrereqErrorMsg] = useState("");// "*The following courses in your planner do not meet prerequisite requirements:";
  const [gradreqErrorMsg, setGradReqErrorMsg] = useState("");//"*This plan does not meet graduation requirements for " + userMajor;
  const [creditErrorMsg, setCreditErrorMsg] = useState("");

  const [userMajor, setValue] = useState("Undecided");

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

  //too many credits error check
  function CheckSemesterCredits2(courseID: string, credit: number, newSemester: number){
    console.log("activated")
    let numSemesters = semesters.length;
    let tempString = "";
    let countingArray = new Array(numSemesters).fill(0);
    let tracker = 0;
    for(let i = 0; i < numSemesters + 1; i++){
      countingArray[i] = 0;
    }
    //insert all credit totals for each semester into countingArray
    
    plannerCourses.map((course) =>
    {
      if(course.id === courseID){
        if(newSemester >= 0){
          countingArray[newSemester] += credit;
          tracker = 1;
        }
      }else{
        if(course.semester >= 0){
          console.log(course)
          countingArray[course.semester] += course.credits;
        }
      }
    }
    )
    if(tracker == 0){
      countingArray[newSemester] += credit;
    }
    console.log(countingArray)
    console.log(semesters)
    //go through each credit total, and look at semester name. If winter and summer, > 4. If fall and spring >= 20
    for( let i = 1; i <= numSemesters; i++){
      if(semesters[i - 1].name.slice(0, 4) === "Fall" || semesters[i - 1].name.slice(0, 6) === "Spring"){
        console.log("main", semesters[i - 1].name)
        if(countingArray[i] > 19.5){
          if(tempString.length != 0){
            tempString += ", " + semesters[i - 1].name;
          }else{
            tempString += semesters[i - 1].name;
          }
        }
      }else if(semesters[i - 1].name.slice(0, 6) === "Winter" || semesters[i - 1].name.slice(0, 6) === "Summer"){
        console.log("else")
        if(countingArray[i] > 4){
          if(tempString.length != 0){
            tempString += ", " + semesters[i - 1].name;
          }else{
            tempString += semesters[i - 1].name;
          }
        }
      }
    }
    if(tempString.length > 0){
      setCreditErrorMsg("Semesters have too many credits " + tempString);
    }else{
      setCreditErrorMsg("");
    }
  }


  const [activeCourse, setActiveCourse] = useState<DItemType | null>(null); //The currently dragged course (may be redundant?)

  function handleDragEnd(event: DragEndEvent){

    const {active, over} = event; //active: The task we're actually dropping
                                  //over: if you are over something that is droppable
    if (!over) {
      return;
    }
    const courseId = active.id as string; //Note: Must typecast this
    const newSemester = over.id as DItemType['semester'] //Note: The column id, so the semester id

    //Checks if the course exists in the planner to see if planner -> planner or courseSearch -> planner logic is used
    let courseInPlanner = false;
    for (let i = 0; i < plannerCourses.length; i++){
      if (plannerCourses[i].id === courseId) courseInPlanner = true;
    }
    if (courseInPlanner){
      updatePlannerCourses(() =>
        
        //This checks if the item already exists in the planner (semester to semester)
        plannerCourses.map((course: DItemType) =>
          course.id === courseId
            ? { ...course, semester: newSemester}
            : course
        )
      );
    }
    //Search for the course in the course listing and add it to the planner
    else{
      let newCourse: DItemType;

      for(let i = 0; i < classList.length; i++){
        console.log(classList[i].id + " " + active.id)
        if (classList[i].id === active.id){
          newCourse = classList[i];
          newCourse.semester = over.id as number;
          break;
        }
      }

      updatePlannerCourses(() =>
        [...plannerCourses, newCourse]
      )
    }
    setMasterList(() =>
      masterList.map((course: DItemType) =>
        course.id === courseId
          ? { ...course, semester: newSemester,}
          : course
      )
    )
    //Every other check to do when a course is dragged
    {
      setLastDraggedCourseId(courseId);
      setLastDraggedSemester(newSemester);
    
      // Run prereq check using the updated course list
      //let newString = checkPrereq(plannerCourses, courseId, newSemester, unmetPrereqs, setUnmetPrereqs);
      //setUnmetPrereqs(newString)

      //Check for missing major requirements
      let majorList:String[] = [];
      if(userMajor != "Undecided")
        majorList = checkMajor(plannerCourses, jsonContent.Majors.find((m)=>(m.name == userMajor))?.prerequisites, 5000, majorList, courseId, newSemester == 0);
      let majorReqs = "";
      if(majorList.length > 0)
        majorReqs += "The following graduation requirements for your major are not met:\n";

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
      //check all other classes for prerequisites
      let newString = checkAllPrereqsUnmet(masterList, courseId, newSemester, unmetPrereqs, setUnmetPrereqs);
      setUnmetPrereqs(newString);
      const tempList = unmetPrereqs.slice(1,2);
      setUnmetPrereqs(tempList);
      setPrereqErrorMsg(() => {
        if (newString.length > 0) {
          return "The following courses do not meet prerequisites: " + newString.join(", ");
        }
        else{
          return "Empty";
        }
      });
      CheckSemesterCredits2(courseId, masterList[findIndexByID(courseId, masterList)].credits, newSemester);
      
    }
    setActiveCourse(null);
  }

  function handleDragStart(event:DragStartEvent) {
    const {active} = event;
    if(active){
      const courseId = active.id as string;

      //If the course is in the planner
      for(let i = 0; i < plannerCourses.length; i++){
        if(plannerCourses[i].id == courseId){
          setActiveCourse(plannerCourses[i]);
          return;
        }
      }

      //If the course is in course search
      //O(n) time, kind of bad runtime
      for(let i = 0; i < masterList.length; i++){
        console.log("test!!!");
        if(masterList[i].id == courseId){
          setActiveCourse(masterList[i]);
          return;
        }
      }
      console.log("done");
    }
  }
  
  return (
    <html>
      <body>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Helvetica"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sofia"/>
        <div id="sidebar" className={styles.sidebarStyle}>
          <div className={styles.picture1}/> <br/> <hr/>

          <div style={{paddingLeft:15}}>
            <p id="Update Major Dropdown" className={styles.text1}>
              Major: &nbsp;
              <select  value={userMajor} onChange={event => UpdateMajor(event)} className={styles.majorDecideStyle}>
              <option value={"Undecided"}>Undecided</option>
                {
                  majors.map((major) =>
                  <option value={major.name} key={major.name}>{major.name}</option>)
                }
              </select>
            </p>
            
            <div className={styles.text1} style={{paddingTop:5, paddingBottom:20}}>Recommended Credits per Semester: {GetRecCredits()}</div>
            <div style={{textAlign: 'left'}}>
              <a className={styles.text2} target="_blank" href="https://apps.my.umbc.edu/pathways/">See four year pathways</a>
            </div>

            <div id="Prereq Notifications" style={{paddingTop:20}}>
              <p className={styles.notificationStyle}>{prereqErrorMsg}</p>
              <br/>
              <p className={styles.notificationStyle}>{gradreqErrorMsg}</p>
              <br/>
              <p className={styles.notificationStyle}>{creditErrorMsg}</p>
            </div>
          </div>
        </div>


        <div style={{marginLeft:250}}>
            <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
              
              {Planner ({setSelectedCourse}, plannerCourses, {updatePlannerCourses},
                        semesters, {updateSemesters}, 
                        masterList, {setMasterList}, prereqErrorMsg, {setPrereqErrorMsg}, unmetPrereqs, {setUnmetPrereqs},
                        {CheckSemesterCredits2}, creditErrorMsg, {setCreditErrorMsg}
                      )//used for error msgs
                        }
              {CourseSearch ({setSelectedCourse}, masterList)}

              <DragOverlay>
                {activeCourse ? (
                  <RenderDItem course={activeCourse} callbackFunction={() => ""} setSelectedCourse={setSelectedCourse} />
                ): null}
              </DragOverlay>

            </DndContext>
            
            <CourseInfo course={selectedCourse}/>
          
           {/*<div style={{clear:'both'}}>
            <button  type="button" onClick={openNotes}>Open notes</button>
            {notesOpen ? <NotesMenu callbackFunction={closeNotes}/> : <></>}
          </div>*/}
        </div>
      </body>
    </html>
  );
}

