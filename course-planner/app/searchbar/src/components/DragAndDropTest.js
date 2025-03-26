'use client';
import React, {useState} from 'react'
import {ScrollView} from 'react-dom'
import { closestCorners, DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import styles from "./page.module.css";

const DItem = (props) => {}

//A zone where things can be dropped
//Only semesters
function Droppable(props)
{

    return(
        <div className ={dropZoneStyle}>
            {props.children}
        </div>
    );

}

//The actual dynamic list itself
const DynamicList = ({elements, setElements}) =>
{}

export default Droppable;