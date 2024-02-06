import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  // imports:[UserModule],
  // controllers: [MailController],
  // providers: [MailService]
})
export class MailModule {}
