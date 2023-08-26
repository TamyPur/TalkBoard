export type TForum = {
    _id:number;
    id: number;
    admin: string;
    issue: string;
    isPublic: Boolean;
    lastEdited ?: Date;
    password: string;
    description: string;
    usersList: Array<string>;
  };