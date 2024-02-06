import { Controller, Post, Param, Body, Headers } from '@nestjs/common';
import { MailService } from './mail.service';
import { Forum } from 'src/schemas/forum.schema';
import { User } from 'src/schemas/user.schema';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Post('sendMail')
  sendMail(@Body() forum: Forum, @Headers('Authorization') auth: string) {
    return this.mailService.sendMail(forum, auth);
  }

  @Post('sendMailPassword')
  sendMailPassword(@Body() user: User) {
    return this.mailService.sendMailPassword(user)
  }
}
