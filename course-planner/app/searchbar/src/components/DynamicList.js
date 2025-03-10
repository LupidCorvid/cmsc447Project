'use client';
import React, {useState} from 'react'
import {ScrollView} from 'react-dom'
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

//Display elements in box
const DynamicList = (props) =>
{
    //var elements = ["Component", "component2", "Comper3"];

    return(
        <div style={{
            borderStyle:'solid',
            overflowY:'scroll',
            height:'200px',
            width:'150px'}}>
            {props.elements.map((element, i) => {
                return <div key={i}><DndContext>
                <DItem/>
            </DndContext></div>
            })}
        </div>
        
    );
}
//{elements.map((element, i) => React.createElement(element, {Key:i}))}
export default DynamicList;