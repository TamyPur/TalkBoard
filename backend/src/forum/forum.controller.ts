import { Body, Headers, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ForumService } from './forum.service';
import { Forum } from 'src/schemas/forum.schema';
import { AuthGuard } from 'src/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/role.enum';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { ObjectId } from 'mongoose';
import { log } from 'console';

@ApiTags('forum')
@Controller('forum')

export class ForumController {
  constructor(private readonly forumService: ForumService) {
  }

  @Post('enterToForum/:forumId')
  enterToForum(@Param('forumId') forumId: ObjectId, @Headers('Authorization') auth: string): Promise<any> {
    return this.forumService.enterToForum(auth, forumId);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() forum: Forum, @Headers('Authorization') auth: string): Promise<any> {
    return this.forumService.create(forum, auth);
  }


  @UseGuards(AuthGuard)
  @Get()
  getAll(): Promise<Forum[]> {
    return this.forumService.getAll();
  }

  @Get(':id')
  getForum(@Param('id') id: ObjectId, @Headers('Authorization') auth: string): Promise<any> {
    return this.forumService.getForum(id, auth);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  update(@Param('id') id: ObjectId, @Body() forum: Forum, @Headers('Authorization') auth: string) {
    return this.forumService.update(id, forum, auth);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: ObjectId) {
    return this.forumService.delete(id);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post(':forumId')
  updateDate(@Param('forumId') forumId: ObjectId): Promise<any> {
    return this.forumService.updateDate(forumId);
  }


}



