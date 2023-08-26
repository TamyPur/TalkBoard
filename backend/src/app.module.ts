import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { jwtConstants } from './user/constants';
import { ForumModule } from './forum/forum.module';
import { ForumController } from './forum/forum.controller';
import { ForumService } from './forum/forum.service';
import { ForumSchema } from './schemas/forum.schema';
import { MessageModule } from './message/message.module';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import {MessageSchema} from './schemas/message.schema'


@Module({
  imports: [UserModule,ForumModule ,MongooseModule.forRoot('mongodb://localhost/TalkBorddb'),
  MongooseModule.forFeature([{name: 'User', schema: UserSchema},{name: 'Forum', schema: ForumSchema},{name: 'Message', schema: MessageSchema}]),
  MessageModule, 
],
  controllers: [AppController,UserController,ForumController,MessageController],
  providers: [JwtService,AppService,UserService,ForumService,MessageService],
})
export class AppModule {}
