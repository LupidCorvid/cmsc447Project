//In order to use DItems as a state array, it needs to be a tyescript struct here
export type DItemType = {
  id: string;
  semester: number; //0 = course search
}
export type PlannerProps = {
  id: string;
  numSemesters: number;
  courses: DItemType[];
}
export type CourseSearchProps = {
  id: string;
  courses: DItemType[];
}
export type SemesterProps = {
  semester_id: number;
  name: string;
  courses: DItemType[];
}