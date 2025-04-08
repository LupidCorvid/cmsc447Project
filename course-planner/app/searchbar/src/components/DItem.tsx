import React, {useState} from 'react'
import {useDraggable} from '@dnd-kit/core';
import styles from "./page.module.css";
import { DItemType } from './types';
import {rem} from '../../page.tsx';

type DItemProps = {
    course: DItemType;
}

//Render a draggable item as markdown
//Props: A DItemType object
export function RenderDItem({course}:DItemProps) {
    
    //useDraggable: A DnD hook for marking an item as draggable. Defines the ID for the draggable object
    //Transform: holds the x and y coordinates of the thing that's being dragged. 
        //Needs to be updated in the div's style so that you can visibly see it be dragged
    //You don't have to worry about what attributes and listeners are, just spread them in the div
    const {attributes, listeners, setNodeRef, transform} = useDraggable({id: course.id});

    const transformStyle = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined
    }

    //TODO: conflicting with the drag event
    //TODO: not saving changes
    function removeFromPlanner(){
        console.log("removeFromPlanner triggered");
        //course.semester = -2;
        //course = Object.assign(course, {...course, semester: -2});
        //console.log("debug: ", course.semester);
    }

    function showCourseInfo(){
        console.log("showCourseInfo triggered");
    }


    let nbsp = "\u00A0"

    return(
        <div ref={setNodeRef} style={transformStyle} {...listeners} {...attributes} className={styles.draggableStyle}>
            {course.id} {nbsp}
            <button id="info btn" onClick={showCourseInfo} className={styles.courseInfoBtnStyle}><i>i</i></button> {nbsp}
            <button id="remove btn" onClick={removeFromPlanner} className={styles.remCourseBtnStyle}>X</button>
        </div>
    );
}