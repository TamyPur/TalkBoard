import { Body, Controller, Get, Param, Post, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/schemas/user.schema';
import { ApiTags } from '@nestjs/swagger';
import { response } from 'express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  getAll(): Promise<any> {
    return this.userService.getAll();
  }

  @Get('getCurrentUser')
  getCurrentUser(@Headers('Authorization') auth: string): Promise<any> {
    return this.userService.getCurrentUser(auth);
  }

  @Get(':id')
  getUserById(@Param('id') id: number): any {
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
}


