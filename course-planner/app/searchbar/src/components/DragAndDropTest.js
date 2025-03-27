'use client';
import React, {useState} from 'react'
import {ScrollView} from 'react-dom'
import { closestCorners, DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import styles from "./page.module.css";
import RenderDItem from "./DItem";

//A zone where things can be dropped, aka semesters
//What would be passed to it would be the droppable items
//Props: semesterProps object
function Droppable(props)
{
    useDroppable({
        id: props.id //ID of the semester
    });

    return(
        <div className ={styles.dropZoneStyle}>
            {props.id}
        </div>
    );

}

//The actual dynamic list itself
const DynamicList = ({elements, setElements}) =>
{}

export default Droppable;