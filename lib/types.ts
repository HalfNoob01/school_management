export type SearchParams = Promise<{ [key: string]: string | undefined }>

export type FormContainerProps =  {
    table : 'teacher' | 'student' | 'parent' | 'subject' | 'class'| 'lesson' | 'exam' | 'assignment' | 'result' | 'attendance' | 'event' | 'announcement';
    type : 'create' |  'update' | 'delete';
    data? : any;
    id? : number | string
}
