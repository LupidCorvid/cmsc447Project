'use client';
import React, {useState} from 'react'
import {ScrollView} from 'react-dom'
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

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

//Display elements in box
const DynamicList = (props) =>
{
    var elements = ["Component", "component2", "Comper3"];

    const onEndDrag =  ((props) =>
    {
        if(props.over == null)
            return;

        if(typeof(props.over) == typeof(DynamicList) & props.over != this);
        {
            elements.pop();
            props.over.elements.push(this);
        }

    });

    return(
        <div style={{
            borderStyle:'solid',
            overflowY:'scroll',
            overflowX:'hidden',
            height:'200px',
            width:'150px'}}>
            {props.elements.map((element, i) => {
                return <div key={i}><DndContext onDragEnd={onEndDrag}>
                <DItem text={element}/>
            </DndContext></div>
            })}
        </div>
        
    );
}
//{elements.map((element, i) => React.createElement(element, {Key:i}))}
export default DynamicList;