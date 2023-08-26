import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type MessageDocument = Message & Document;

@Schema()
export class Message {
    _id: Types.ObjectId
    @Prop({required: true})
    forumId: Types.ObjectId;
    @Prop({required: true})
    owner: Types.ObjectId;
    @Prop()
    content: string;
    @Prop()
    date: Date;
    @Prop()
    deleted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
