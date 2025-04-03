import React, { useState,useEffect } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';
import styles from "./page.module.css";
import {DItemType, SemesterProps} from './types';
import { RenderSemester } from './Semester';
//2 CMSC classes of 4XX or higher formatted as MLTCMSC42

function findIndexByID(classID, classList){
    index = 0;
    for (let i = 0; i < classList.length; i++){
        if(classList[i].id === classID){
            index = i;
        }
    }
    return index;
}
function checkMultiple(classList, prereqString, prereqPlacement){
    department = prereqString.slice(3, 7);
    level = prereqString.slice(7, 8);
    number = prereqString.slice(8, 9);
    numberValid = 0;
    for(let i = 0; i < classList.length; i++){
        //if correct department or level
            //if prereqplacement >= semester and semester != 0
                //numberValid++
        if(classList[i].id.slice(0, 4) === department && Number(classList[i].id.slice(5, 6)) >= Number(level)){
            if(prereqPlacement >= classList[i].semester){
                numberValid++;
            }
        }
    }
    if(numberValid >= Number(number)){
        return true;
    }else{
        return false;
    }
}

function checkPrereq(classList, classID, semesterPlaced, listPrereqsNotMet){
    firstlayer = true;
    secondlater = false;
    thridlayer = true;
    theClass = classList[findIndexByID(classID, classList)]; //=to the class which belongs to the classID
    prereqClass;
    //and
    for(let i = 0; i < theClass.prerequisites.length; i++){
        //or
        secondLayer = false;
        for(let j = 0; j < theClass.prerequisites[i].length; j++){
            //and
            thirdLayer = true;
            for(let k = 0; k < theClass.prerequisites[i][j].length; k++){
                //if string "number of required level classes, do something"
                //check list for ID and get index
                //check if index semester is <= semesterPlaced and not 0
                //if less, return false
                if(theClass.prerequisites[i][j][k].slice(0,3) === "MLT"){
                    if(!checkMultiple(classList, theClass.prerequisites[i][j][k], semesterPlaced)){
                        thirdLayer = false;
                    }
                }else{
                    prereqClass = classList[findIndexByID(theClass.prerequisites[i][j][k])]
                    if(prereqClass.semester > semesterPlaced || prereqClass.semester == 0){
                        thirdLayer = false;
                }
            }
            if(thirdLayer){
                secondLayer = true;
            }
            //if the and is false, and this is false, this is false
            //if the and is false, and this is true, this is true
        }
        if(!secondLayer){
            firstLayer = false;
        }
        //if the or is false, this is false and add this classID to listPrereqsnotmet
    }
    if(firstlayer == false){
        //append classID to listPrereqsNotMet
        listPrereqsNotMet.append(classID);
    }
}

}