import { TCategory } from "./category";

export type TForum = {
    _id:string;
    admin: string;
    subject: string;
    isPublic: Boolean;
    lastEdited : Date;
    password: string;
    description: string;
    usersList: Array<string>;
    categoriesList:Array<TCategory>
  };