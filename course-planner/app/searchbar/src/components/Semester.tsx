import { useDroppable } from '@dnd-kit/core';
import {RenderDItem} from './DItem';
import {DItemType} from './types';
import styles from "./page.module.css";

type SemesterProps = {
    semester_id: number;
    name: string;
    courses: DItemType[];
    callbackFunction: (n:string) => void;
}

type FunctionType = () => void;


//Renders each course that belongs to the semester
export function RenderSemester({semester_id, name, courses, callbackFunction}:SemesterProps){
    //setNodeRef: a reference to the div that we want to apply this to
    //useDroppable: DnD kit hook that marks a section as a drop zone. Defines the ID for the drop zone
    const { setNodeRef } = useDroppable({id: semester_id }); //Makes it so that the semester is a drop zone

    return(
    //setNodeRef: a marker so that useDroppable knows to apply its functionality to this specific div
    <div ref={setNodeRef} className ={styles.dropZoneStyle}>
        <div className={styles.semTitleStyle}>{name}</div>
        {courses.map((course) =>
            {return <RenderDItem course={course} key={course.id} callbackFunction={callbackFunction} />;
        })}
    </div>
    );
}