import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document, Types } from "mongoose";

export type CategotyDocument = Category & Document;

@Schema()
export class Category {
    @ApiProperty()
    _id: Types.ObjectId
    @ApiProperty()
    @Prop({required: true})
    name: string;  

}
export const CategorySchema = SchemaFactory.createForClass(Category);