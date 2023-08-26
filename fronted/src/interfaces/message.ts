export type TMessage = {
    _id:Object;
    id: number;
    forumId: number;
    owner: number;
    content: String;
    date: Date;
    deleted: Boolean;
  };