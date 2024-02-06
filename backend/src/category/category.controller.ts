import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth.guard';
import { Role } from 'src/role.enum';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { Category } from 'src/schemas/category.schema';
import { CategoryService } from './category.service';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get()
  gatAll(): Promise<any> {
    return this.categoryService.getAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SystemAdmin)
  @Post()
  create(@Body() category: Category): Promise<any> {
    return this.categoryService.create(category);
  }

}
