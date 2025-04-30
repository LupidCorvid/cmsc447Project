import {DItemType, SemesterProps, MajorProps, PublicNote} from './searchbar/src/components/types';

//Public notes
const publicNotes: PublicNote[] = [];



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
        courseID:course,
        author:author,
        reviewed:false,
        note:contents
    }

    publicNotes.concat(newNote);
}

export function ReviewNote(accept:boolean)
{
    //Needs to be able to grab a specific note
    //If accept, mark note as reviewed. If not, remove note from notes listing

    let gottenNote:PublicNote = {
        courseID:'TEMPEMPTY',
        author:"TEMPEMPTY",
        reviewed:false,
        note:"TEMPEMPTY"
    }

    if(accept)
    {
        gottenNote.reviewed = true;
    }
    else
    {
        RemoveNote();
    }
}

export function RemoveNote()
{
    //Need a way to identify individual notes
}