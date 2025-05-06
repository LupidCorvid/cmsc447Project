import React, { useState,useEffect, InputHTMLAttributes } from 'react';
import {DItemType, SemesterProps, MajorProps, PublicNote} from './searchbar/src/components/types';
import {GetNotesForCourse, GetNoteByID, GetNotesByAuthor, RemoveNote, PublishNote, ReviewNote} from './PublicNotes';
import { Righteous } from 'next/font/google';
import { relative } from 'path';
import styles from "./searchbar/src/components/page.module.css";

type NoteProps = {
    callbackFunction: () => void; //Everything put in HTML should have props associated here (I guess...)
}

export function NotesMenu(input:NoteProps)
{
    const [noteText, setNoteText] = useState("");
    const [, forceUpdate] = React.useReducer(x => x + 1, 0)
        
      
    function PostNote()
    {
        let noteId = PublishNote("user", "CMSC203", noteText);
        ReviewNote(true, noteId);
        console.log(GetNotesForCourse("CMSC203"))
        forceUpdate();
    }

    const textChanged = (e:any) =>
    {
        if(e.target.value != undefined)
            setNoteText(e.target.value)
    }

    function closeNotes()
    {
        input.callbackFunction();
    }

    return (<>
    <div style={
        {display:"block",
            position:"absolute",
            top:0,
            bottom:0,
            left:0,
            right:0,
            color:'black',
            opacity: .5,
            zIndex:1,
            backgroundColor: "#000000",
            height: '100vh',
            width: '100vw'
        }}>
    </div>
    <div style={{
        opacity:1,
        backgroundColor: "#FFFFFF",
        position: "relative",
        top: "7%",
        bottom: "10%",
        left: "17%",
        right: "25%",
        zIndex:2,
        height: "80vh",
        width: "75vw",
    }
    }>
        <div >
            <button type="button" onClick={closeNotes}
                    style={{float:'right', paddingTop:10, paddingRight:20, fontWeight: 'bold', fontSize: 20, backgroundColor:'transparent', 
                            border:'none', cursor: 'pointer', outline: 'inherit', color:'rgb(119, 116, 116)'}}>X</button>
        </div>

        <h2 style={{paddingTop:10, paddingLeft:150, float: 'left'}}>Notes from Students</h2> 
        <h2 style={{paddingTop:10, paddingRight:130, float: 'right'}}>Make a note for CMSC 202</h2>
        <div className={styles.noteboxStyle} style={{clear:'both', float:'left'}}>{GetNotesForCourse("CMSC203").map((e:PublicNote) =>
            <h1>{e.note}</h1>
            )}</div>
        
        <div style={{clear:'right', float:'right', paddingRight:90}}>
            <div style={{}}>Note Contents:</div>
            <textarea name='NoteContents' cols={60} rows={20} style={{resize:'none'}} 
                      onChange={textChanged} value={noteText}></textarea><br/>
            <button type="button" onClick={PostNote}>Post Note</button>
            
        </div>
    </div>
    </>);
}