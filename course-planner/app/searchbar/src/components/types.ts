//In order to use DItems as a state array, it needs to be a tyescript struct here

export type DItemType = {
  id: string;
  prereqs: string;
  semester: number; //0 = course search
  credits: number;
}

//Not used yet
export type PlannerProps = {
  id: string;
  numSemesters: number;
  courses: DItemType[];
}

//Not used yet
export type CourseSearchProps = {
  id: string;
  courses: DItemType[];
}

export type SemesterProps = {
  semester_id: number;
  name: string;
  courses: DItemType[];
}

export type MajorProps = {
  name: string;
  reqCourses: string; //This string will need to be parsed similar to course prereqs
}