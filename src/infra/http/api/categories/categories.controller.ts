import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/common/guards";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { RouteAdmin } from "src/common/decorators/admin.decorator";

@UseGuards(JwtGuard)
@RouteAdmin()
@Controller('category')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get('/all')
    async getCategories() {
        return await this.categoriesService.getAllCategories()
    }

    @Get('/find')
    async getCategoryById(@Query('id') id: string) {
        return await this.categoriesService.getCategoryById(id)
    }

    @Post('/create')
    async createCategory(@Body() createCategory: CreateCategoryDto) {
        return await this.categoriesService.createCategory(createCategory);
    }

    @Patch('update/:id')
    async updateCategory(@Param('id') id: string, @Body() updateCategory: UpdateCategoryDto) {
        return await this.categoriesService.updateCategory(id, updateCategory)
    }

    @Patch('delete/:id')
    async deleteCategory(@Param('id') id: string) {
        return await this.categoriesService.deleteCategory(id);
    }
}