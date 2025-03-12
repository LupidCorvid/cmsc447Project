'use client';
import React, {useState} from 'react'
import {ScrollView} from 'react-dom'
import { closestCorners, DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

//NEED TO CHANGE THIS TO BE IMPORTED
const DItem = ({text}) => {
    const {attributes, listeners, setNodeRef, transform} = useDraggable(
        {id: 'draggable-item',}
    );
    const style = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : '',
        padding: '20px',
        backgroundColor: 'lightblue',
        cursor: 'grab',
        width: '100px',
        textAlign: 'center',
    }

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style = {style}>
            {text}
        </div>
    )
}

function Droppable(props)
{
    const {overMe, nodeRef} = useDroppable({
        id:props.id
    });

    return (
        <div ref={nodeRef} style={props.style}>
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
        <DndContext>
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