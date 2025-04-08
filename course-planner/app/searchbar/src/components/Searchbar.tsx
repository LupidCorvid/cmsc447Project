'use client';
import React, {ChangeEventHandler, useEffect, useState} from 'react'
import {DItemType, SemesterProps, MajorProps} from './types';
import {RenderDItem} from './DItem';
import styles from "./page.module.css";
import test from 'node:test';

const testerValues: DItemType[] = [
    {id:"CMSC 202", prereqs: "", semester: 0, credits:3},
    {id:"CMSC 203", prereqs: "", semester: 0, credits:3},
    {id:"CMSC 331", prereqs: "", semester: 0, credits:3},
    {id:"CMSC 341", prereqs: "", semester: 0, credits:3},
]

const Searchbar = () =>
{
    //Need to find data format for the table
    const [searchInput, setSearchInput] = useState<string>("");
    const input = ["tester", "tester2"];
    
    //React.ChangeEvent<any> is the type for variable e
    const filterChanged = (e: React.ChangeEvent<any>) =>
    {
        setSearchInput(e.target.value);
    }

    const filteredInputs = testerValues.filter((element) =>
    {
        if(searchInput === '')
        {
            return true;
        }
        else
        {
            return element.id.toLowerCase().includes(searchInput.toLowerCase());
        }
    })

    return (
        <div>
            <input type="text" placeholder = "Class name..." onChange={filterChanged} value={searchInput} className={styles.searchbarStyle}></input>
            <div id="List of courses by filter" className={styles.searchScrollStyle}>
                {filteredInputs.map((course) =>
                {return <RenderDItem course={course} key={course.id} />; })}
            </div>
        </div>
    );
};

export default Searchbar;