'use client';
import React, {useState} from 'react'


const Searchbar = () =>
{
    //Need to find data format for the table
    const [searchInput, setSearchInput] = useState("");

    const filterChanged = (e) =>
    {
        setSearchInput(e.value)
    }

    
    
    return <div>
    <input
    type="text"
    placeholder = "Class name..."
    onChange={filterChanged}
    value={searchInput}
    style={{width:"150px"}}>
    </input>
    </div>
};

export default Searchbar;