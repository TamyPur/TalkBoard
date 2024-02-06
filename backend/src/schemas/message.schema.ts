import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";


export type MessageDocument = Message & Document;

@Schema()
export class Message {
    deleteOne(): void {
        throw new Error('Method not implemented.');
    }
    @ApiProperty()
    _id: Types.ObjectId
    @ApiProperty()
    @Prop({ required: true })
    forumId: Types.ObjectId;
    @ApiProperty()
    @Prop({ required: true })
    owner: Types.ObjectId;
    @ApiProperty()
    @Prop()
    content: string;
    @ApiProperty()
    @Prop()
    date: Date;
    @ApiProperty()
    @Prop()
    deleted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
