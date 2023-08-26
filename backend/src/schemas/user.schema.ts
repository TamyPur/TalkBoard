import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Collection, Document, SchemaTypes, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
    _id: Types.ObjectId
    @Prop({required: true})
    name: string;
    @Prop({required: true, unique: true})
    email: string;  

}
export const UserSchema = SchemaFactory.createForClass(User);

