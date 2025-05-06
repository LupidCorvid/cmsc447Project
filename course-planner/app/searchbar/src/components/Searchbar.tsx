'use client';
import React, {ChangeEventHandler, useEffect, useState} from 'react'
import {DItemType, SemesterProps, MajorProps} from './types';
import {RenderDItem} from './DItem';
import styles from "./page.module.css";
import test from 'node:test';
import jsonData from './test.json';

const testerValues: DItemType[] = jsonData.name
type SearchbarProps = {
    removeFromPlanner: (courseId: string) => void;
    setSelectedCourse: (course: DItemType) => void;
    masterList: DItemType[];
};
const Searchbar = ({ removeFromPlanner, setSelectedCourse, masterList }: SearchbarProps) =>
{
    //Need to find data format for the table
    const [searchInput, setSearchInput] = useState<string>("");
    
    //React.ChangeEvent<any> is the type for variable e
    const filterChanged = (e: React.ChangeEvent<any>) =>
    {
        setSearchInput(e.target.value);
    }

    const filteredInputs = masterList.filter((element) =>
    {
        if(searchInput === '')
        {
            return false; //Don't show until user searches for something
        }
        else
        {
            if (element.semester == -1)
                return element.id.toLowerCase().includes(searchInput.toLowerCase());
            else
                return false;
        }
    })

    return (
        <div>
            <input type="text" placeholder = "Enter a course name or number" onChange={filterChanged} value={searchInput} className={styles.searchbarStyle}></input>
            <div id="List of courses by filter" className={styles.courseSearchScrollStyle}>

                {
                (searchInput.length == 0) ? <div style={{clear:'both', color:'gray', marginTop: 50}}></div> :
                filteredInputs.map((course) =>
                {return <RenderDItem course={course} key={course.id + "_CS"} callbackFunction={removeFromPlanner}
                setSelectedCourse={setSelectedCourse}/>; }) 
                }
            </div>
        </div>
    );
};

export default Searchbar;