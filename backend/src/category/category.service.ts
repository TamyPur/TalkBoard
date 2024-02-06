import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class CategoryService {

    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }

    async getAll(): Promise<Category[]> {
        return await this.categoryModel.find().exec()
    }

    async create(category: Category) : Promise<Category> {
        const newCategory = await new this.categoryModel(category);
        return newCategory.save();
    }

    async delete(id: ObjectId): Promise<Category> {
        const c = await this.categoryModel.findById(id).exec()
        if (!c) {
          throw new Error(`category with id ${id} not found`);
        }
        await c.deleteOne();
        return c;
      }
}
