import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ok } from 'assert';
import { Model, ObjectId } from 'mongoose';
import { Message } from 'src/schemas/message.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MessageService {

    constructor(@InjectModel(Message.name) private messageModel: Model<Message>,
     private readonly userService: UserService,
      private jwtService: JwtService) { }

      async getAll(): Promise<Message[]> {
        return await this.messageModel.find().exec();

    }

      async getByForum(_forumId: ObjectId): Promise<Message[]> {
        return await this.messageModel.find({ forumId: _forumId }).exec();
    }

    async getMessage(_id: ObjectId): Promise<Message> {
        return await this.messageModel.findById(_id);

    }

    async create(message: Message, auth: string): Promise<Message> {
        const currentUser = this.userService.getCurrentUser(auth);
        const newMessage = await new this.messageModel(message);
        newMessage.owner = (await currentUser)._id
        return newMessage.save();
    }

    async deleteMessage(_id: ObjectId, auth: string): Promise<Message> {
        const currentUser = this.userService.getCurrentUser(auth);
        const message = await this.getMessage(_id);
        const token = await this.userService.extractToken(auth);
        const decoded = await this.userService.decode(token);
        if (!(await currentUser)._id.equals(message.owner) && !(decoded.roles?.includes('admin'))) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        return await this.messageModel.findOneAndUpdate({ _id: _id }, { deleted: true, date: Date.now() }, { new: true }).exec();
    }

    async deleteByForumId(_forumId: ObjectId): Promise<any> {
        const messages = await this.getByForum(_forumId);
        messages.forEach(m => m.deleteOne());
        return ok;
    }
}
