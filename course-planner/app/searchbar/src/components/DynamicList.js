'use client';
import React, {useState} from 'react'
import {ScrollView} from 'react-dom'
import { closestCorners, DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

//NEED TO CHANGE THIS TO BE IMPORTED
const DItem = (props) => {
    const {attributes, listeners, setNodeRef, transform} = useDraggable(
        {id: props.id,}
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
        <div ref={setNodeRef} style = {{
            borderStyle:'solid',
            height:'300px',
            width:'200px'
        }}>
            {props.children}
        </div>
    );
}

//Display elements in box
//A possible reference for how to do this:
//https://stackblitz.com/edit/react-1j37eg?file=src%2FApp.js
const DynamicList = ({elements, setElements}) =>
{
    const [droppedItems, setDroppedItems] = useState([])

    const onEndDrag =  event =>
    {
        
        const {active, over} = event;

        console.log(event);
        //Always seems to be null
        if(!active || !over)
            return;

        console.log("self not null")
        if(over == null)
            return;
        console.log("not null")

        if(over.id === 'drop-zone'){
            setElements((prev) => prev.filter(item => item !== active.id));
            if (!droppedItems.includes(active.id)) {
                setDroppedItems((prev) => [...prev, active.id]);
            }
        }
        if(over.id === 'og-list'){
            setDroppedItems((prev) => prev.filter(item => item !== active.id));
            if (!elements.includes(active.id)) {
                setElements((prev) => [...prev, active.id]);
            }
        }
    };

    return(
        <DndContext onDragEnd={onEndDrag} collisionDetection={closestCorners}>
        <div style={{
            borderStyle:'solid',
            //            overflowY:'scroll',
            //           overflowX: 'hidden',
            //height:'200px',
            //width:'150px'
            }} >
            
            <Droppable id = "og-list">
            {elements.map((element) => (
                <DItem key = {element} id = {element} text = {element}/>
            
            ))}

        </Droppable>
        
        {/*drop area*/}
        <Droppable id="drop-zone">
                    {droppedItems.map((item) => (
                        <DItem key={item} id={item} text={item} />
                    ))}
                </Droppable>



        </div>
        </DndContext>
        
    );
}
//{elements.map((element, i) => React.createElement(element, {Key:i}))}
export default DynamicList;