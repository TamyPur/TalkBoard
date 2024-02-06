import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";


export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {
    @ApiProperty()
    _id: Types.ObjectId
    @ApiProperty()
    @Prop()
    userId: Types.ObjectId;
    @ApiProperty()
    @Prop()
    name: string;
    @ApiProperty()
    @Prop({type: Object})
    logo: ObjectId;
    @ApiProperty()
    @Prop()
    description: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);