'use client';
import React, {useState} from 'react'
import DynamicList from "./DynamicList"
import styles from "./page.module.css";

const Searchbar = () =>
{
    //Need to find data format for the table
    const [searchInput, setSearchInput] = useState("");
    const input = ["tester", "tester2"];

    const filterChanged = (e) =>
    {
        setSearchInput(e.target.value)
    }

    const filteredInputs = input.filter((element) =>
    {
        if(searchInput === '')
        {
            return element;
        }
        else
        {
            //return true;
            return element.toLowerCase().includes(searchInput);
        }
    })
    

    return <div>
    <input
    type="text"
    placeholder = "Course name..."
    onChange={filterChanged}
    value={searchInput}
    className={styles.searchbarStyle}>
    </input>
    <DynamicList elements={filteredInputs}>
    </DynamicList>
    </div>
};

export default Searchbar;