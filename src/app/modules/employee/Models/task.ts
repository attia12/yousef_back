import { title } from 'process';
export interface Task {
    ID?:string;
    id:number;
    Title?:string;
    Type?:string;
    user_id?:any;
    Completed:boolean;
    Description?:string;
}