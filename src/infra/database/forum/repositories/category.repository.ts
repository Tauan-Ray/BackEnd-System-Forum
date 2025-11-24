import { Injectable } from '@nestjs/common';
import { PrismaForumService } from '../prisma.forum.service';
import { CreateCategoryDto } from 'src/infra/http/api/categories/dto';
import { UpdateCategoryDto } from 'src/infra/http/api/categories/dto/update-category.dto';

@Injectable()
export class PrismaCategoryRespository {
  constructor(private readonly prismaService: PrismaForumService) {}

  async getAllCategories() {
    const categories = await this.prismaService.category.findMany({
      where: { DEL_AT: null },
    });

    return categories;
  }

  async getCategoryByName(name: string) {
    const category = await this.prismaService.category.findFirst({
      where: {
        CATEGORY: name,
        DEL_AT: null,
      },
    });

    return category;
  }

  async getCategoryById(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        ID_CT: id,
        DEL_AT: null,
      },
    });

    return category;
  }

  async createCategory(category: CreateCategoryDto) {
    const createdCategory = await this.prismaService.category.create({
      data: {
        CATEGORY: category.name.trim(),
      },
    });

    return {
      message: 'Categoria criada com sucesso',
      data: createdCategory,
    };
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    const updatedCategory = await this.prismaService.category.update({
      where: {
        ID_CT: id,
      },
      data: {
        CATEGORY: data.name,
      },
    });

    return {
      message: 'Categoria atualizada com sucesso',
      data: updatedCategory,
    };
  }

  async deleteCategory(id: string) {
    await this.prismaService.category.update({
      where: {
        ID_CT: id,
      },
      data: {
        DEL_AT: new Date(),
      },
    });
  }
}
