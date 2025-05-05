import React, {useState} from 'react'
import {useDraggable} from '@dnd-kit/core';
import styles from "./page.module.css";
import { DItemType } from './types';

type DItemProps = {
    course: DItemType;
    callbackFunction: (n:string) => void; //Everything put in HTML should have props associated here (I guess...)
    setSelectedCourse: (course: DItemType) => void;
}

//Render a draggable item as markdown
//Props: A DItemType object
export function RenderDItem({course, callbackFunction, setSelectedCourse}:DItemProps) {
    
    //useDraggable: A DnD hook for marking an item as draggable. Defines the ID for the draggable object
    //Transform: holds the x and y coordinates of the thing that's being dragged. 
        //Needs to be updated in the div's style so that you can visibly see it be dragged
    //You don't have to worry about what attributes and listeners are, just spread them in the div
    const {attributes, listeners, setNodeRef} = useDraggable({id: course.id});

    /*const transformStyle = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined
    }*/

    //TODO: conflicting with the drag event
    //TODO: not saving changes
    /*function removeFromPlanner(){
        console.log("removeFromPlanner triggered");
        course.semester = -2; //Doesn't save to page.tsx
        //return RenderDItem();
        //return <RenderDItem course = {course}/>; //Makes the object float on the sreen
        //return; //Does nothing
    }*/
    function test(){
        callbackFunction(course.id);
    }

    function showCourseInfo(){
        setSelectedCourse(course);
        console.log("showCourseInfo triggered");

    }


    let nbsp = "\u00A0"

    if(course.semester > -1){
        return(
            <div ref={setNodeRef} {...listeners} {...attributes} className={styles.draggableStyle}>
                {course.id} {nbsp}
                <button id="info btn" onClick={showCourseInfo}
                onPointerDown={(e) => e.stopPropagation()}
                className={styles.courseInfoBtnStyle}><i>i</i></button> {nbsp}
                <button id="remove btn" onClick={test}
                onPointerDown={(e) => e.stopPropagation()} className={styles.remCourseBtnStyle}>X</button>
            </div>
        );
    }
    else{
        return;
    }
}