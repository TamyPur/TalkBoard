import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
    @ApiProperty()
    _id: Types.ObjectId
    @ApiProperty()
    @Prop({required: true})
    name: string;
    @ApiProperty()
    @Prop({required: true, unique: true})
    email: string; 
    @ApiProperty()
    @Prop({required: true, unique: true, minlength: 8, maxlength: 14})
    password: string; 
    @ApiProperty()
    @Prop()
    address: string;
    @ApiProperty()
    @Prop({maxlength: 40})
    occupation: string;
    @ApiProperty()
    @Prop({maxlength: 10})
    phoneNumber: string; 
    @ApiProperty()
    @Prop()
    profilePicture:  Types.ObjectId;    
    @ApiProperty()
    @Prop({default: true})
    active: boolean; 
    @ApiProperty()
    @Prop({default: false})
    needDeletePassword: boolean; 
    @ApiProperty()
    @Prop({default: ""})
    tempPassword: string;

}
export const UserSchema = SchemaFactory.createForClass(User);

