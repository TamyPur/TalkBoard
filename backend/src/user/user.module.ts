import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AppModule } from 'src/app.module';
import { UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { GridFsMulterConfigService } from 'src/files/multer-config.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
   MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    FilesModule,
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
  }),
],
  providers:[UserService],
  controllers:[UserController],
  exports:[UserService]
})
export class UserModule { }
