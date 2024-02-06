import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { Customer } from 'src/schemas/customers.scheme';

@Injectable()
export class CustomerService {
    constructor(@InjectModel(Customer.name) private customerModel: Model<Customer>
        , private readonly filesService: FilesService
    ) { }

    async getAll(): Promise<Customer[]> {
        return await this.customerModel.find().exec()
    }

    async getCustomer(_userId: mongoose.Types.ObjectId): Promise<Customer> {
        return await this.customerModel.findOne({ userId: _userId }).exec()
    }

    async create(customer: Customer, logo: Express.Multer.File, _userId: mongoose.Types.ObjectId): Promise<Customer> {        
        const c = await this.customerModel.findOne({ userId: _userId })
        if (c)
            this.update(customer, logo, c._id)
        else {
            const newCustomer = new this.customerModel(customer);
            newCustomer.userId = _userId;
            newCustomer.logo = await this.filesService.upload(logo);
            return newCustomer.save()
        }

    }

    async update(customer: Customer, logo: Express.Multer.File, _id: mongoose.Types.ObjectId): Promise<Customer> {
        const c = await this.customerModel.findById(_id).exec()
        if (!c) {
            throw new Error(`customer with id ${_id} not found`);
        }
        try {
            customer.logo = await this.filesService.upload(logo);
        } catch {
            customer.logo = c.logo
        }
        Object.assign(c, customer);
        const updatedCustomer = await c.save();
        return updatedCustomer;
    }

    async delete(id: mongoose.Types.ObjectId): Promise<Customer> {
        const c = await this.customerModel.findById(id).exec()
        if (!c) {
            throw new Error(`customer with id ${id} not found`);
        }
        await c.deleteOne();
        return c;
    }
}
