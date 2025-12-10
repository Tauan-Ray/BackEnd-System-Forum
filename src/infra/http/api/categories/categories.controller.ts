import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/common/guards';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, FindManyCategoriesDto } from './dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RouteAdmin } from 'src/common/decorators/admin.decorator';
import { getCategoryIdDto } from './dto/get-category-id.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiCreateCategory,
  ApiDeleteCategory,
  ApiGetAllCategories,
  ApiGetCategoryById,
  ApiRestoreCategory,
  ApiUpdateCategory,
} from 'src/common/decorators/swagger/categories';
import { ApiForbiddenResponse } from 'src/common/decorators/swagger/api-forbiddenResponse.decorator';

@ApiTags('Categories')
@ApiBearerAuth()
@ApiResponse({ status: 500, description: 'Erro interno no servidor' })
@ApiForbiddenResponse()
@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/all')
  @ApiGetAllCategories()
  async getAllCategories(@Query() query: FindManyCategoriesDto) {
    return await this.categoriesService.getAllCategories(query);
  }

  @Get('/find')
  @ApiGetCategoryById()
  async getCategoryById(@Query() categoryId: getCategoryIdDto) {
    return await this.categoriesService.getCategoryById(categoryId.id);
  }

  @Post('/create')
  @RouteAdmin()
  @UseGuards(JwtGuard)
  @ApiCreateCategory()
  async createCategory(@Body() createCategory: CreateCategoryDto) {
    return await this.categoriesService.createCategory(createCategory);
  }

  @Patch('/update/:id')
  @RouteAdmin()
  @UseGuards(JwtGuard)
  @ApiUpdateCategory()
  async updateCategory(
    @Param() categoryId: getCategoryIdDto,
    @Body() updateCategory: UpdateCategoryDto,
  ) {
    return await this.categoriesService.updateCategory(categoryId.id, updateCategory);
  }

  @Patch('/delete/:id')
  @RouteAdmin()
  @UseGuards(JwtGuard)
  @ApiDeleteCategory()
  async deleteCategory(@Param() categoryId: getCategoryIdDto) {
    return await this.categoriesService.deleteCategory(categoryId.id);
  }

  @Patch('/restore/:id')
  @ApiBearerAuth()
  @ApiRestoreCategory()
  async restoreCategory(@Param() id: getCategoryIdDto) {
    return await this.categoriesService.restoreCategory(id.id);
  }
}
