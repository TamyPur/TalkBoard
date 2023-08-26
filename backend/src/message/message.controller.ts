import { Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiTags } from '@nestjs/swagger';
import { Message } from 'src/schemas/message.schema';
import { Role } from 'src/role.enum';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { AuthGuard } from 'src/auth.guard';
import { ObjectId } from 'mongoose';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get(':forumId')
  getByForum(@Param('forumId') forumId: ObjectId): Promise<any> {
    return this.messageService.getByForum(forumId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post()
  create(@Body() message: Message, @Headers('Authorization') auth: string): Promise<any> {
    return this.messageService.create(message, auth);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post(':id')
  async deleteMessage(@Param('id') id: ObjectId, @Headers('Authorization') auth: string): Promise<any> {
      return await this.messageService.deleteMessage(id, auth);
  }

}
