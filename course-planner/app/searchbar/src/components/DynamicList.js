'use client';
import React, {useState} from 'react'
import {ScrollView} from 'react-dom'
import { closestCorners, DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import styles from "./page.module.css";

//NEED TO CHANGE THIS TO BE IMPORTED
const DItem = (props) => {
    const {attributes, listeners, setNodeRef, transform} = useDraggable(
        {id: 'draggable-item',}
    );
    /*const style = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : '',
        padding: '20px',
        backgroundColor: 'lightblue',
        cursor: 'grab',
        width: '100px',
        textAlign: 'center',
    }*/

    const transformStyle = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : ''
    }

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className={styles.draggableStyle} style={transformStyle}>
            {props.text}
        </div>
    )
}

function Droppable(props)
{
    const {isOver, setNodeRef} = useDroppable({
        id:props.id
    });


    return (
        <div ref={setNodeRef} classname={styles.plannerStyle}>
            {props.children}
        </div>
    );
}

//Display elements in box
//A possible reference for how to do this:
//https://stackblitz.com/edit/react-1j37eg?file=src%2FApp.js
const DynamicList = (props) =>
{
    var elements = ["Component", "component2", "Comper3"];


    const onEndDrag =  event =>
    {
        
        const {active, over} = event;

        console.log(event);
        //Always seems to be null
        if(active == null)
            return;

        console.log("self not null")
        if(over == null)
            return;
        console.log("not null")

        if(over instanceof DynamicList && over != this);
        {
            elements.pop(this);
            over.elements.push(this);
        }
    };

    return(
        <DndContext onDragEnd={onEndDrag} collisiondetection="true">
        <Droppable id={props.listId}>
        <div style={{
            borderStyle:'solid',
            overflowY:'scroll',
            overflowX: 'hidden',
            height:'200px',
            width:'150px'}} collisiondetection="true">
            {props.elements.map((element, i) => {
                return <div key={i} collisiondetection="true"><DndContext onDragEnd={onEndDrag}
                collisionDetection={closestCorners}>
                <DItem text={element}/>
            </DndContext></div>
            })}

        </div></Droppable></DndContext>
        
    );
}
//{elements.map((element, i) => React.createElement(element, {Key:i}))}
export default DynamicList;