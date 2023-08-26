import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

export type ForumDocument = Forum & Document;


@Schema()
export class Forum {
    _id: Types.ObjectId
    @Prop({required: true})
    admin: Types.ObjectId;
    @Prop({required: true})
    issue: string;
    @Prop()
    isPublic: boolean;
    @Prop()
    lastEdited: Date;
    @Prop({required: true})
    password: string;
    @Prop()
    description: string;
    @Prop()
    usersList: Array<string>;

}

export const ForumSchema = SchemaFactory.createForClass(Forum);

