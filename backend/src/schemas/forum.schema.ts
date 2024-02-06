import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Category } from "./category.schema";
import { ApiProperty } from "@nestjs/swagger";

export type ForumDocument = Forum & Document;


@Schema()
export class Forum {
    @ApiProperty()
    _id: Types.ObjectId
    @ApiProperty()
    @Prop({required: true})
    admin: Types.ObjectId;
    @ApiProperty()
    @Prop({required: true})
    subject: string;
    @ApiProperty()
    @Prop()
    isPublic: boolean;
    @ApiProperty()
    @Prop()
    lastEdited: Date;
    @ApiProperty()
    @Prop({required: true, unique:true})
    password: string;
    @ApiProperty()
    @Prop()
    description: string;
    @ApiProperty()
    @Prop()
    usersList: Array<string>;
    @ApiProperty()
    @Prop()
    categoriesList: Array<Category>

}

export const ForumSchema = SchemaFactory.createForClass(Forum);

