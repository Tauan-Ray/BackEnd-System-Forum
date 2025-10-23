import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/common/guards';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RouteAdmin } from 'src/common/decorators/admin.decorator';
import { getCategoryIdDto } from './dto/get-category-id.dto';

@UseGuards(JwtGuard)
@RouteAdmin()
@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/all')
  async getAllCategories() {
    return await this.categoriesService.getAllCategories();
  }

  @Get('/find')
  async getCategoryById(@Query() categoryId: getCategoryIdDto) {
    return await this.categoriesService.getCategoryById(categoryId.id);
  }

  @Post('/create')
  async createCategory(@Body() createCategory: CreateCategoryDto) {
    return await this.categoriesService.createCategory(createCategory);
  }

  @Patch('update/:id')
  async updateCategory(
    @Param() categoryId: getCategoryIdDto,
    @Body() updateCategory: UpdateCategoryDto,
  ) {
    return await this.categoriesService.updateCategory(categoryId.id, updateCategory);
  }

  @Patch('delete/:id')
  async deleteCategory(@Param() categoryId: getCategoryIdDto) {
    return await this.categoriesService.deleteCategory(categoryId.id);
  }
}
