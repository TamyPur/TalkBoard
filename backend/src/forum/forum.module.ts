import { Module } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { ForumSchema } from 'src/schemas/forum.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports:[MongooseModule.forFeature([{name: 'Forum', schema: ForumSchema}]),UserModule,MessageModule],
  controllers: [ForumController],
  providers: [ForumService]
})
export class ForumModule {}
