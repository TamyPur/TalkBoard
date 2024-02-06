import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from 'src/auth.guard';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/role.enum';
import { Customer } from 'src/schemas/customers.scheme';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import mongoose, { ObjectId } from 'mongoose';

@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        customer: {
          type: 'object',
          format: 'Customer',
        },
        file: {
          type: 'string',
          format: 'binary',
        }
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post(':userId')
  upload(@Body() customer: Customer, @UploadedFile() image: Express.Multer.File, @Param('userId') usreId:mongoose.Types.ObjectId) {
    return this.customerService.create(customer, image, usreId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get()
  getAll(){
    return this.customerService.getAll()
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get(':userId')
  getCustomer(@Param('userId') usreId:mongoose.Types.ObjectId){
    return this.customerService.getCustomer(usreId)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SystemAdmin)
  @Post('delete/:id')
  delete(@Param('id') id:mongoose.Types.ObjectId){  
    return this.customerService.delete(id)
  }
}
