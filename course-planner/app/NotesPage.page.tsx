import React, { useState,useEffect, InputHTMLAttributes } from 'react';
import {DItemType, SemesterProps, MajorProps, PublicNote} from './searchbar/src/components/types';
import {GetNotesForCourse, GetNoteByID, GetNotesByAuthor, RemoveNote, PublishNote, ReviewNote} from './PublicNotes';
import { Righteous } from 'next/font/google';
import { relative } from 'path';
import styles from "./searchbar/src/components/page.module.css";

export function NotesMenu()
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

    return (<><div style={
        {display:"block",
            position:"absolute",
            top:0,
            bottom:0,
            left:0,
            right:0,
            color:'black',
            opacity: .5,
            zIndex:1,
            backgroundColor: "#000000"
        }}>

    </div>
    <div style={{
        opacity:1,
        backgroundColor: "#FFFFFF",
        position: "relative",
        top: "10%",
        bottom: "10%",
        left: "25%",
        right: "25%",
        zIndex:2,
        height: "80vh",
        width: "50vw",
    }
    }>
        
        <h1>Make a note for CMSC 202</h1>
        Note:
        <textarea name='NoteContents' cols={20} rows={20} className={styles.noteTextbox} onChange={textChanged} value={noteText}></textarea><br/>
        <button type="button" onClick={PostNote}>Post Note</button>
        {GetNotesForCourse("CMSC203").map((e:PublicNote) =>
            <h1>{e.note}</h1>
            )}

        
    </div>
    </>);
}