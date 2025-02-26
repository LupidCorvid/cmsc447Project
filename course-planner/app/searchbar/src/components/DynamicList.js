'use client';
import React, {useState} from 'react'
import {ScrollView} from 'react-dom'

//Display elements in box
const DynamicList = () =>
{
    const elements = ["Component", "component2", "Comper3"];

    return(
        <div style={{
            borderStyle:'solid',
            overflowY:'scroll',
            height:'200px',
            width:'150px'}}>
            {elements.map((element, i) => {
                return <div key={i}>{element}</div>
            })}
        </div>
        
    );
}
//{elements.map((element, i) => React.createElement(element, {Key:i}))}
export default DynamicList;