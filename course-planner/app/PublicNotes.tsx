import {DItemType, SemesterProps, MajorProps, PublicNote} from './searchbar/src/components/types';

//Public notes
let publicNotes: PublicNote[] = [];
let currNoteID = 0;


export function GetNotesForCourse(course:string)
{
    let returnList:PublicNote[] = [];

    publicNotes.forEach((e)=>
    {
        if(e.courseID == course && e.reviewed == true)
            returnList.concat(e);
    });
}

export function GetNotesByAuthor(author:string)
{
    let returnList:PublicNote[] = [];

    publicNotes.forEach((e)=>
    {
        if(e.author == author && e.reviewed == true)
            returnList.concat(e);
    });
}

export function PublishNote(author:string, course:string, contents:string)
{
    let newNote:PublicNote = {
        noteID:currNoteID,
        courseID:course,
        author:author,
        reviewed:false,
        note:contents
    }

    currNoteID++;
    publicNotes.concat(newNote);
}

export function GetNoteByID(iD:number)
{
    return publicNotes.find((e)=>
    {
        return e.noteID == iD;
    });
}

export function ReviewNote(accept:boolean, noteID:number)
{
    //Needs to be able to grab a specific note
    //If accept, mark note as reviewed. If not, remove note from notes listing

    let gottenNote = GetNoteByID(noteID);

    if(gottenNote == null)
        return;

    if(accept)
    {
        gottenNote.reviewed = true;
    }
    else
    {
        RemoveNote(noteID);
    }
}

export function RemoveNote(noteID:number)
{
    publicNotes = publicNotes.filter((e) =>
    {
        return e.noteID != noteID
    })
}