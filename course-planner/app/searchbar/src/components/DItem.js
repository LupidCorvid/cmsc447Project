import React, {useState} from 'react'
import {ScrollView} from 'react-dom'
import { closestCorners, DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import styles from "./page.module.css";

//Render a draggable item as markdown
//Props: A DItemType object
const RenderDItem = (props) => {
    return(
        <div className={styles.draggableStyle} key={props.id}>
            {props.id}
        </div>
    );
}

export default RenderDItem;