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
                numberValid++;
                if(numberValid >= Number(number)){
                    break;
                }
            }
        }
    }
    if(numberValid >= Number(number)){
        return true;
    }else{
        return false;
    }
}
//classList is a struct as outlined in the test.json
//class ID is a string in the format of department level EX: "CMSC 201"
//semesterPlaced is a number indicating which semester it was placed in
//listPrereqsNotMet is a list that is changed with this function. If prerequisites are not met, classID is passed in
export function checkPrereq(classList, classID, semesterPlaced, listPrereqsNotMet, setList){
    let firstLayer = true;
    let secondLayer = false;
    let thirdLayer = true;
    let index = findIndexByID(classID, classList);
    let theClass = classList[index]; //=to the class which belongs to the classID
    let prereqClass;
    console.log(classID);
    console.log(semesterPlaced);

    //case of no prerequisites
    if(theClass.prerequisites.length === 1 && theClass.prerequisites[0].length === 1 && theClass.prerequisites[0][0].length === 0){
        console.log("empty");
        return listPrereqsNotMet;
    }
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
                    if(!checkMultiple(classList, theClass.prerequisites[i][j][k], semesterPlaced, classID)){
                        thirdLayer = false;
                    }
                }else{
                    prereqClass = classList[findIndexByID(theClass.prerequisites[i][j][k], classList)]
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
        //if the or is false, this is false and add this classID to listPrereqsnotmet
        }
        if(!secondLayer){
            firstLayer = false;
        }
    }
    if(firstLayer == false){
        //append classID to listPrereqsNotMet
        //for state support, use: setList(list => [...list, classID])
        if((!checkUnmet(classID, listPrereqsNotMet) && semesterPlaced != 0)){
            console.log("added");
            return [...listPrereqsNotMet, classID];
        }else if(semesterPlaced == 0){
            console.log("taken out 94");
            return listPrereqsNotMet.filter(id => id !== classID);
        }
        console.log("not met");
        return listPrereqsNotMet;
    }else{
        if(checkUnmet(classID, listPrereqsNotMet)){
            console.log("taken out 101");
            return listPrereqsNotMet.filter(id => id !== classID);
        }
        console.log("met");
    }
    console.log("2", listPrereqsNotMet);
    return listPrereqsNotMet;

}

export function checkMajor(classList, prereqList, semesterPlaced, listPrereqsNotMet){
    console.log("start major check");
    let firstLayer = true;
    let secondLayer = false;
    let thirdLayer = true;
    let prereqClass;
    let tempPrereqsNotMetList = [];
    //and
    for(let i = 0; i < prereqList.length; i++){
        //or
        secondLayer = false;
        for(let j = 0; j < prereqList[i].length; j++){
            //and
            thirdLayer = true;
            for(let k = 0; k < prereqList[i][j].length; k++){
                //if string "number of required level classes, do something"
                //check list for ID and get index
                //check if index semester is <= semesterPlaced and not 0
                //if less, return false
                console.log(prereqList[i][j][k]);
                if(prereqList[i][j][k].slice(0,3) === "MLT"){
                    if(!checkMultiple(classList, prereqList[i][j][k], semesterPlaced, "MAJOR")){
                        thirdLayer = false;
                        //Add the reason for failure to a temp list, which is only used if an OR statement doesn't make up for this
                        //being missing
                        tempPrereqsNotMetList.push(prereqList[i][j][k]);
                        console.log("missing" + prereqList[i][j][k]);
                    }
                }else{
                    prereqClass = classList[findIndexByID(prereqList[i][j][k], classList)]
                    if(prereqClass.semester > semesterPlaced || prereqClass.semester == 0){
                        thirdLayer = false;
                        //Add the reason for failure to a temp list, which is only used if an OR statement doesn't make up for this
                        //being missing
                        tempPrereqsNotMetList.push(prereqList[i][j][k]); 
                        console.log("missing" + prereqList[i][j][k]);
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
            console.log("Missing parts: " + tempPrereqsNotMetList);
            tempPrereqsNotMetList.forEach((e) =>
            {
                listPrereqsNotMet.push(e);
            }); // If the OR condition didn't save it, include each of the things that failed
            tempPrereqsNotMetList = [""];
        }
        console.log("firstLayer:", firstLayer);
    }
    if(firstLayer == false){
        //append classID to listPrereqsNotMet
        //for state support, use: setList(list => [...list, classID])
        //listPrereqsNotMet.push(classID);
        console.log("major not met");
    }else{
        console.log("major met");
    }
}

export function findIndexByID(classID, classList){
    let index = 0;
    for (let i = 0; i < classList.length; i++){
        if(classList[i].id === classID){
            index = i;
            break;
        }
    }
    return index;
}
//if classID is in list, it returns true
export function checkUnmet(classID, unmetList){
    let found = false;
    for (let i = 0; i < unmetList.length; i++){
        if(classID === unmetList[i]){
            found = true;
            break;
        }
    }
    return found;
}

export function checkAllPrereqsUnmet(classList, classID, semesterPlaced, listPrereqsNotMet, setList){
    let firstLayer = true;
    let secondLayer = false;
    let thirdLayer = true;
    let index = findIndexByID(classID, classList);
    let theClass = classList[index]; //=to the class which belongs to the classID
    let prereqClass;
    console.log(classID);
    console.log(semesterPlaced);

    let currID;
    let currSemester = 0;
    let currList = listPrereqsNotMet;
    let listString = "";
    let layers = false;
    //case of no prerequisites
    //for loop through classList h is index
    //set layers to default
    //theClass = classList[h]
    //if not classID and semeseter!=0, set currSemester = thClass.semester, currID = theClass.id, layers = true
    //if classID, set currSemester to semesterPlaced and currId to classID, layers = true
    //if layers, go through code
for(let h = 0; h < classList.length; h++){
    layers = false;
    firstLayer = true;
    secondLayer = false;
    thirdLayer = true;
    theClass = classList[h];
    currID = theClass.id;
    currSemester = theClass.semester;
    if(currID != classID && currSemester != 0){
        layers = true;
    }else if(currID === classID){
        layers = true;
        currSemester = semesterPlaced;
    }
    if(theClass.prerequisites.length === 1 && theClass.prerequisites[0].length === 1 && theClass.prerequisites[0][0].length === 0){
        console.log("empty");
        layers = false;
    }
    if(layers){
        
        //and
        for(let i = 0; i < theClass.prerequisites.length; i++){
            //or
            secondLayer = false;
            for(let j = 0; j < theClass.prerequisites[i].length; j++){
                //and
                thirdLayer = true;
                for(let k = 0; k < theClass.prerequisites[i][j].length; k++){
                    if(theClass.prerequisites[i][j][k] === classID){
                        //do something different
                        if(semesterPlaced > currSemester || semesterPlaced == 0){
                            thirdLayer = false;
                        }
                    }else{
                        //if string "number of required level classes, do something"
                        //check list for ID and get index
                        //check if index semester is <= semesterPlaced and not 0
                        //if less, return false
                        if(theClass.prerequisites[i][j][k].slice(0,3) === "MLT"){
                            if(!checkMultiple(classList, theClass.prerequisites[i][j][k], currSemester, currID)){
                                thirdLayer = false;
                            }
                        }else{
                            prereqClass = classList[findIndexByID(theClass.prerequisites[i][j][k], classList)]
                            if(prereqClass.semester > currSemester || prereqClass.semester == 0){
                                thirdLayer = false;
                            }
                        }
                    }
                    if(thirdLayer){
                        secondLayer = true;
                    }
                //if the and is false, and this is false, this is false
                //if the and is false, and this is true, this is true
                }
            //if the or is false, this is false and add this classID to listPrereqsnotmet
            }
            if(!secondLayer){
                firstLayer = false;
            }
        }
        if(firstLayer == false){
            //append classID to listPrereqsNotMet
            //for state support, use: setList(list => [...list, classID])
            if((!checkUnmet(currID, currList) && currSemester != 0)){
                console.log("added");
                //return [...listPrereqsNotMet, classID];
                currList = [...currList, currID];
            }else if(currSemester == 0){
                console.log("taken out 94");
                //return listPrereqsNotMet.filter(id => id !== classID);
                currList = currList.filter(id => id !== currID);
            }
            console.log("not met");
            //return listPrereqsNotMet;
        }else{
            if(checkUnmet(currID, currList)){
                console.log("taken out 101");
                //return listPrereqsNotMet.filter(id => id !== classID);
                currList = currList.filter(id => id !== currID);
            }
            console.log("met");
        }
        console.log("2", currList);
        //return listPrereqsNotMet;
    }
    layers = false;
}
    //outside of h loop
    listString = currList.join(", ");
    return [...listPrereqsNotMet, listString];
}


function testFunc(){

    return "t";
}