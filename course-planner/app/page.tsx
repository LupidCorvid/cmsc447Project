'use client';
import React, { useState,useEffect } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import DynamicList from "./searchbar/src/components/DynamicList";
import Searchbar from "./searchbar/src/components/Searchbar"

import classList from "./test.json";

const DItem = () => {
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
            item
        </div>
    )
}

function TestJSON(){
    return (
      <div>
          {classList.name.map((item, index) => (
              <div key={index}>
                  <p>Class: {item.id}</p>
              </div>
          ))}
      </div>
  );
}

export default function App() {

  return (
    <html>
      <body>
          <TestJSON/>

      </body>
    </html>
    
  );
  }
