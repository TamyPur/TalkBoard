import { Body, Controller, Get, Param, Post, Headers, Put, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/schemas/user.schema';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { response } from 'express';
import { RolesGuard } from 'src/roles.guard';
import { AuthGuard } from 'src/auth.guard';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/role.enum';
import { ObjectId } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { error } from 'console';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SystemAdmin)
  @Get()
  getAll(): Promise<any> {
    return this.userService.getAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('getSystemAdmin')
  getSystemAdmin(): Promise<User> {
    return this.userService.getSystemAdmin()
  }

  @Get('getCurrentUser')
  getCurrentUser(@Headers('Authorization') auth: string): Promise<any> {
    return this.userService.getCurrentUser(auth);
  }

  @Get(':id')
  getUserById(@Param('id') id: string): any {
    return this.userService.getUserById(id);
  }

  @Get(':name/:email')
  getUser(@Param('name') name: string, @Param('email') email: string): any {
    return this.userService.getUser(name, email);
  }

  @Post('signUp')
  signUp(@Body() user: User): Promise<any> {
    try {
      return this.userService.signUp(user);
    } catch (e) {
      response.status(e.status).json(e.message)
    }
  }


  @Post('signIn')
  signIn(@Body() user: User): Promise<any> {
    return this.userService.signIn(user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // customer: {
        //   type: 'object',
        //   format: 'Customer',
        // },
        file: {
          type: 'string',
          format: 'binary',
        }
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Put(':id')
  update(@Param('id') id: ObjectId, @Body() user: User, @Headers('Authorization') auth: string, @UploadedFile() image: Express.Multer.File) {
    try {
      return this.userService.update(id, user, auth, image);
    }
    catch (err) {
      throw new Error(err)
    }

  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SystemAdmin)
  @Put('delete/:id')
  delete(@Param('id') id: ObjectId) {
    return this.userService.delete(id);
  }


  @Post('forgetPassword')
  forgetPassword(@Body() user: User): Promise<any> {
    return this.userService.forgetPassword(user);
  }
}


