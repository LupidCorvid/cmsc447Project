import React, { useState,useEffect } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';
import styles from "./page.module.css";
import {DItemType, SemesterProps} from './types';
import { RenderSemester } from './Semester';
//2 CMSC classes of 4XX or higher formatted as MLTCMSC42
import classList from "./test.json"


export function checkMultiple(classList, prereqString, prereqPlacement, classID){
    let department = prereqString.slice(3, 7);
    let level = prereqString.slice(7, 8);
    let number = prereqString.slice(8, 9);
    let numberValid = 0;
    for(let i = 0; i < classList.length; i++){
        //if correct department or level
            //if prereqplacement >= semester and semester != 0
                //numberValid++
        if(classList[i].id.slice(0, 4) === department && Number(classList[i].id.slice(5, 6)) >= Number(level) && classList[i].id != classID){
            if(prereqPlacement >= classList[i].semester && classList[i].semester != 0){
                //console.log("valid++",classList[i]);
                numberValid++;
            }
        }
    }
    if(numberValid >= Number(number)){
        console.log("MLT check true");
        return true;
    }else{
        console.log("MLT check false");
        return false;
    }
}
//classList is a struct as outlined in the test.json
//class ID is a string in the format of department level EX: "CMSC 201"
//semesterPlaced is a number indicating which semester it was placed in
//listPrereqsNotMet is a list that is changed with this function. If prerequisites are not met, classID is passed in
export function checkPrereq(classList, classID, semesterPlaced, listPrereqsNotMet, setList){
    console.log("start search");
    let firstLayer = true;
    let secondLayer = false;
    let thirdLayer = true;
    let index = findIndexByID(classID, classList);
    let theClass = classList[index]; //=to the class which belongs to the classID
    let prereqClass;
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
                console.log(theClass.prerequisites[i][j][k]);
                if(theClass.prerequisites[i][j][k].slice(0,3) === "MLT"){
                    if(!checkMultiple(classList, theClass.prerequisites[i][j][k], semesterPlaced, classID)){
                        thirdLayer = false;
                    }
                }else{
                    prereqClass = classList[findIndexByID(theClass.prerequisites[i][j][k], classList)]
                    if(prereqClass.semester > semesterPlaced || prereqClass.semester == 0){
                        thirdLayer = false;
                }
                console.log(thirdLayer);
                }
                if(thirdLayer){
                    secondLayer = true;
                }
                console.log("secondLayer:", secondLayer);
            //if the and is false, and this is false, this is false
            //if the and is false, and this is true, this is true
            }
        //if the or is false, this is false and add this classID to listPrereqsnotmet
        }
        if(!secondLayer){
            firstLayer = false;
        }
        console.log("firstLayer:", firstLayer);
    }
    if(firstLayer == false){
        //append classID to listPrereqsNotMet
        //for state support, use: setList(list => [...list, classID])
        setList(listPrereqsNotMet => [...listPrereqsNotMet, classID]);
        console.log("not met");
    }else{
        console.log("met");
    }


}
export function findIndexByID(classID, classList){
    let index = 0;
    for (let i = 0; i < classList.length; i++){
        if(classList[i].id === classID){
            index = i;
        }
    }
    return index;
}