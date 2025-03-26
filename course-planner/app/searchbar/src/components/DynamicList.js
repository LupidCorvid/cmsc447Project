'use client';
import React, {useState} from 'react'
import {ScrollView} from 'react-dom'
import { closestCorners, DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

//NEED TO CHANGE THIS TO BE IMPORTED (for readiblitys sake and reuse elsewhere)
//A class for an item/element that can be drag and dropped
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

//A zone where things can be dropped
function Droppable(props)
{
    const {isOver, setNodeRef} = useDroppable({
        id:props.id
    });


    return (
        <div ref={setNodeRef} style = {{
            borderStyle:'solid',
            height:'300px',
            width:'200px',
            //overflowY:"scroll"
        }}>
            {props.children}
        </div>
    );
}

//The actual dynamic list itself
//Display elements in box
//A possible reference for how to do this:
//https://stackblitz.com/edit/react-1j37eg?file=src%2FApp.js
const DynamicList = ({elements, setElements}) =>
{
    //Semesters as lists
    const [droppedItems1, setDroppedItems1] = useState([])
    const [droppedItems2, setDroppedItems2] = useState([])
    const [droppedItems3, setDroppedItems3] = useState([])
    const [droppedItems4, setDroppedItems4] = useState([])
    const [droppedItems5, setDroppedItems5] = useState([])
    const [droppedItems6, setDroppedItems6] = useState([])
    const [droppedItems7, setDroppedItems7] = useState([])
    const [droppedItems8, setDroppedItems8] = useState([])


    const [searchInput, setSearchInput] = useState([]);

    const filterChanged = (e) =>
    {
        setSearchInput(e.target.value)
    }

    //Searchbar functionality
    const filteredInputs = elements.filter((element) =>
        {
            if(searchInput === '')
            {
                return element;
            }
            else
            {
                //return true;
                //element -> base elements you're working with (full class roster)
                return element.includes(searchInput);
            }
        })
    
    //An event for whenever you let an item go after its dragged over a droppable section
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

        //Each of these blocks checks what list it's being dropped into, then remove the item form every other list
        //Then add in the item to the current list you dropped it into
        if(over.id === 'og-list'){
            setDroppedItems1((prev) => prev.filter(item => item !== active.id));
            setDroppedItems2((prev) => prev.filter(item => item !== active.id));
            setDroppedItems3((prev) => prev.filter(item => item !== active.id));
            setDroppedItems4((prev) => prev.filter(item => item !== active.id));
            setDroppedItems5((prev) => prev.filter(item => item !== active.id));
            setDroppedItems6((prev) => prev.filter(item => item !== active.id));
            setDroppedItems7((prev) => prev.filter(item => item !== active.id));
            setDroppedItems8((prev) => prev.filter(item => item !== active.id));
            if (!elements.includes(active.id)) {
                setElements((prev) => [...prev, active.id]);
            }
        }
        //drop zones 1-8
        if(over.id === 'drop-zone1'){
            setElements((prev) => prev.filter(item => item !== active.id));
            setDroppedItems2((prev) => prev.filter(item => item !== active.id));
            setDroppedItems3((prev) => prev.filter(item => item !== active.id));
            setDroppedItems4((prev) => prev.filter(item => item !== active.id));
            setDroppedItems5((prev) => prev.filter(item => item !== active.id));
            setDroppedItems6((prev) => prev.filter(item => item !== active.id));
            setDroppedItems7((prev) => prev.filter(item => item !== active.id));
            setDroppedItems8((prev) => prev.filter(item => item !== active.id));
            if (!droppedItems1.includes(active.id)) {
                setDroppedItems1((prev) => [...prev, active.id]);
            }
        }
        if(over.id === 'drop-zone2'){
            setElements((prev) => prev.filter(item => item !== active.id));
            setDroppedItems1((prev) => prev.filter(item => item !== active.id));
            setDroppedItems3((prev) => prev.filter(item => item !== active.id));
            setDroppedItems4((prev) => prev.filter(item => item !== active.id));
            setDroppedItems5((prev) => prev.filter(item => item !== active.id));
            setDroppedItems6((prev) => prev.filter(item => item !== active.id));
            setDroppedItems7((prev) => prev.filter(item => item !== active.id));
            setDroppedItems8((prev) => prev.filter(item => item !== active.id));
            if (!droppedItems2.includes(active.id)) {
                setDroppedItems2((prev) => [...prev, active.id]);
            }
        }
        if(over.id === 'drop-zone3'){
            setElements((prev) => prev.filter(item => item !== active.id));
            setDroppedItems2((prev) => prev.filter(item => item !== active.id));
            setDroppedItems1((prev) => prev.filter(item => item !== active.id));
            setDroppedItems4((prev) => prev.filter(item => item !== active.id));
            setDroppedItems5((prev) => prev.filter(item => item !== active.id));
            setDroppedItems6((prev) => prev.filter(item => item !== active.id));
            setDroppedItems7((prev) => prev.filter(item => item !== active.id));
            setDroppedItems8((prev) => prev.filter(item => item !== active.id));
            if (!droppedItems3.includes(active.id)) {
                setDroppedItems3((prev) => [...prev, active.id]);
            }
        }
        if(over.id === 'drop-zone4'){
            setElements((prev) => prev.filter(item => item !== active.id));
            setDroppedItems2((prev) => prev.filter(item => item !== active.id));
            setDroppedItems3((prev) => prev.filter(item => item !== active.id));
            setDroppedItems1((prev) => prev.filter(item => item !== active.id));
            setDroppedItems5((prev) => prev.filter(item => item !== active.id));
            setDroppedItems6((prev) => prev.filter(item => item !== active.id));
            setDroppedItems7((prev) => prev.filter(item => item !== active.id));
            setDroppedItems8((prev) => prev.filter(item => item !== active.id));
            if (!droppedItems4.includes(active.id)) {
                setDroppedItems4((prev) => [...prev, active.id]);
            }
        }
        if(over.id === 'drop-zone5'){
            setElements((prev) => prev.filter(item => item !== active.id));
            setDroppedItems2((prev) => prev.filter(item => item !== active.id));
            setDroppedItems3((prev) => prev.filter(item => item !== active.id));
            setDroppedItems4((prev) => prev.filter(item => item !== active.id));
            setDroppedItems1((prev) => prev.filter(item => item !== active.id));
            setDroppedItems6((prev) => prev.filter(item => item !== active.id));
            setDroppedItems7((prev) => prev.filter(item => item !== active.id));
            setDroppedItems8((prev) => prev.filter(item => item !== active.id));
            if (!droppedItems5.includes(active.id)) {
                setDroppedItems5((prev) => [...prev, active.id]);
            }
        }
        if(over.id === 'drop-zone6'){
            setElements((prev) => prev.filter(item => item !== active.id));
            setDroppedItems2((prev) => prev.filter(item => item !== active.id));
            setDroppedItems3((prev) => prev.filter(item => item !== active.id));
            setDroppedItems4((prev) => prev.filter(item => item !== active.id));
            setDroppedItems5((prev) => prev.filter(item => item !== active.id));
            setDroppedItems1((prev) => prev.filter(item => item !== active.id));
            setDroppedItems7((prev) => prev.filter(item => item !== active.id));
            setDroppedItems8((prev) => prev.filter(item => item !== active.id));
            if (!droppedItems6.includes(active.id)) {
                setDroppedItems6((prev) => [...prev, active.id]);
            }
        }
        if(over.id === 'drop-zone7'){
            setElements((prev) => prev.filter(item => item !== active.id));
            setDroppedItems2((prev) => prev.filter(item => item !== active.id));
            setDroppedItems3((prev) => prev.filter(item => item !== active.id));
            setDroppedItems4((prev) => prev.filter(item => item !== active.id));
            setDroppedItems5((prev) => prev.filter(item => item !== active.id));
            setDroppedItems6((prev) => prev.filter(item => item !== active.id));
            setDroppedItems1((prev) => prev.filter(item => item !== active.id));
            setDroppedItems8((prev) => prev.filter(item => item !== active.id));
            if (!droppedItems7.includes(active.id)) {
                setDroppedItems7((prev) => [...prev, active.id]);
            }
        }
        if(over.id === 'drop-zone8'){
            setElements((prev) => prev.filter(item => item !== active.id));
            setDroppedItems2((prev) => prev.filter(item => item !== active.id));
            setDroppedItems3((prev) => prev.filter(item => item !== active.id));
            setDroppedItems4((prev) => prev.filter(item => item !== active.id));
            setDroppedItems5((prev) => prev.filter(item => item !== active.id));
            setDroppedItems6((prev) => prev.filter(item => item !== active.id));
            setDroppedItems7((prev) => prev.filter(item => item !== active.id));
            setDroppedItems1((prev) => prev.filter(item => item !== active.id));
            if (!droppedItems8.includes(active.id)) {
                setDroppedItems8((prev) => [...prev, active.id]);
            }
        }
    };

    return(
        
        <DndContext onDragEnd={onEndDrag} collisionDetection={closestCorners}>
            <input
            type="text"
            placeholder = "Class name..."
            onChange={filterChanged}
            value={searchInput}
            style={{width:"150px"}}>
            </input>
        <div style={{
            borderStyle:'solid',
            //            overflowY:'scroll',
            //           overflowX: 'hidden',
            //height:'200px',
            //width:'150px'
            }} >
            
            <Droppable id = "og-list">
            {filteredInputs.map((element) => (
                <DItem key = {element} id = {element} text = {element}/>
            
            ))}

        </Droppable>
        
        {/*drop area 1-8*/}
        <Droppable id="drop-zone1">
                    {droppedItems1.map((item) => (
                        <DItem key={item} id={item} text={item} />
                    ))}
        </Droppable>
        <Droppable id="drop-zone2">
                    {droppedItems2.map((item) => (
                        <DItem key={item} id={item} text={item} />
                    ))}
        </Droppable>
        <Droppable id="drop-zone3">
                    {droppedItems3.map((item) => (
                        <DItem key={item} id={item} text={item} />
                    ))}
        </Droppable>
        <Droppable id="drop-zone4">
                    {droppedItems4.map((item) => (
                        <DItem key={item} id={item} text={item} />
                    ))}
        </Droppable>
        <Droppable id="drop-zone5">
                    {droppedItems5.map((item) => (
                        <DItem key={item} id={item} text={item} />
                    ))}
        </Droppable>
        <Droppable id="drop-zone6">
                    {droppedItems6.map((item) => (
                        <DItem key={item} id={item} text={item} />
                    ))}
        </Droppable>
        <Droppable id="drop-zone7">
                    {droppedItems7.map((item) => (
                        <DItem key={item} id={item} text={item} />
                    ))}
        </Droppable>
        <Droppable id="drop-zone8">
                    {droppedItems8.map((item) => (
                        <DItem key={item} id={item} text={item} />
                    ))}
        </Droppable>
        </div>
        </DndContext>
        
    );
}
//{elements.map((element, i) => React.createElement(element, {Key:i}))}
export default DynamicList;