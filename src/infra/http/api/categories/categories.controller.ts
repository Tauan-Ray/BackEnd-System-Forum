import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/common/guards';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RouteAdmin } from 'src/common/decorators/admin.decorator';
import { getCategoryIdDto } from './dto/get-category-id.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiCreateCategory,
  ApiDeleteCategory,
  ApiGetAllCategories,
  ApiGetCategoryById,
  ApiUpdateCategory,
} from 'src/common/decorators/swagger/categories';
import { ApiForbiddenResponse } from 'src/common/decorators/swagger/api-forbiddenResponse.decorator';

@ApiTags('Categories - only ADMIN')
@ApiBearerAuth()
@ApiResponse({ status: 500, description: 'Erro interno no servidor' })
@ApiForbiddenResponse()
@UseGuards(JwtGuard)
@RouteAdmin()
@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/all')
  @ApiGetAllCategories()
  async getAllCategories() {
    return await this.categoriesService.getAllCategories();
  }

  @Get('/find')
  @ApiGetCategoryById()
  async getCategoryById(@Query() categoryId: getCategoryIdDto) {
    return await this.categoriesService.getCategoryById(categoryId.id);
  }

  @Post('/create')
  @ApiCreateCategory()
  async createCategory(@Body() createCategory: CreateCategoryDto) {
    return await this.categoriesService.createCategory(createCategory);
  }

  @Patch('update/:id')
  @ApiUpdateCategory()
  async updateCategory(
    @Param() categoryId: getCategoryIdDto,
    @Body() updateCategory: UpdateCategoryDto,
  ) {
    return await this.categoriesService.updateCategory(categoryId.id, updateCategory);
  }

  @Patch('delete/:id')
  @ApiDeleteCategory()
  async deleteCategory(@Param() categoryId: getCategoryIdDto) {
    return await this.categoriesService.deleteCategory(categoryId.id);
  }
}
