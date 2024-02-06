export type TMessage = {
    _id:string;
    id: number;
    forumId: string;
    owner: number;
    content: String;
    date: Date;
    deleted: Boolean;
  };