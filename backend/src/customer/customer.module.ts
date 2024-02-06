import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { GridFsMulterConfigService } from 'src/files/multer-config.service';
import { FilesService } from 'src/files/files.service';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from 'src/schemas/customers.scheme';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
    FilesModule,
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
  }),],
  controllers: [CustomerController],
  providers: [ CustomerService]
})
export class CustomerModule { }
