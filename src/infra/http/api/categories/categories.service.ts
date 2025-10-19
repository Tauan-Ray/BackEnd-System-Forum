import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaCategoryRespotiory } from 'src/infra/database/forum/repositories/category.repository';
import { CreateCategoryDto } from './dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: PrismaCategoryRespotiory) {}

  async getAllCategories() {
    const allCategories = await this.categoryRepository.getAllCategories();

    return allCategories;
  }

  async getCategoryById(id: string) {
    const categoryById = await this.categoryRepository.getCategoryById(id);

    return categoryById;
  }

  async createCategory(createCategory: CreateCategoryDto) {
    const categoryWithSameName = await this.categoryRepository.getCategoryByName(
      createCategory.name.trim(),
    );
    if (categoryWithSameName)
      throw new ConflictException('Categoria com o mesmo nome já existente');

    const createdCategory = await this.categoryRepository.createCategory(createCategory);

    return createdCategory;
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    const existingCategory = this.getCategoryById(id);
    if (!existingCategory) throw new NotFoundException('Categoria não existente');

    const categoryWithSameName = await this.categoryRepository.getCategoryByName(data.name);
    if (categoryWithSameName)
      throw new ConflictException('Categoria com o mesmo nome já existente');

    const updatedCategory = await this.categoryRepository.updateCategory(id, data);

    return updatedCategory;
  }

  async deleteCategory(id: string) {
    const existingCategory = this.getCategoryById(id);
    if (!existingCategory) throw new NotFoundException('Categoria não existente');

    await this.categoryRepository.deleteCategory(id);

    return { message: 'Categoria deletada com sucesso' };
  }
}
