import React from 'react';
import {DItemType, SemesterProps, MajorProps, PublicNote} from './searchbar/src/components/types';
import {GetNotesForCourse, GetNoteByID, GetNotesByAuthor, RemoveNote, PublishNote} from './PublicNotes';
import { Righteous } from 'next/font/google';
import { relative } from 'path';
import styles from "./searchbar/src/components/page.module.css";

export function NotesMenu()
{
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
        <textarea name='NoteContents' cols={20} rows={20}></textarea>
        {GetNotesForCourse("CMSC203").map((e:PublicNote) =>
    <h1>{e.note}</h1>
    )}

        
    </div>
    </>);
}