import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProperty } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  // @ApiProperty()
  // @Get(':word')
  // getHello(@Param('word') word:string): string {
  //   return this.appService.getHello(word);
  // }


  
}
