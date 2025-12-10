import { Injectable } from '@nestjs/common';
import { PrismaForumService } from '../prisma.forum.service';
import { CreateCategoryDto, FindManyCategoriesDto } from 'src/infra/http/api/categories/dto';
import { UpdateCategoryDto } from 'src/infra/http/api/categories/dto/update-category.dto';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaCategoryRespository {
  constructor(private readonly prismaService: PrismaForumService) {}

  async getAllCategories(
    {
      page = 0,
      limit = 10,
      ID_CT,
      CATEGORY,
      DT_IN,
      DT_FM,
    }: Prisma.CategoryWhereInput & FindManyCategoriesDto,
    addDelAt = true,
  ) {
    const qry: Prisma.CategoryFindManyArgs<DefaultArgs> = {
      where: {
        ...(addDelAt && { DEL_AT: null }),
      },
      skip: page * limit,
      take: limit,
      orderBy: {
        DT_UP: 'desc',
      },
    };

    if (DT_IN || DT_FM) {
      qry.where!.DT_CR = {
        gte: DT_IN ? new Date(DT_IN.setHours(0, 0, 0)) : undefined,
        lte: DT_FM ? new Date(DT_FM.setHours(23, 59, 59)) : undefined,
      };
    }

    if (ID_CT) qry.where!.ID_CT = ID_CT;
    if (CATEGORY) qry.where!.CATEGORY = { contains: CATEGORY, mode: 'insensitive' };

    const total = await this.prismaService.category.count({ where: qry.where });
    const _data = await this.prismaService.category.findMany(qry);

    return {
      _data,
      _meta: {
        _results: _data.length,
        _total_results: total,
        _page: page + 1,
        _total_page: Math.ceil(total / limit),
      },
    };
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

  async restoreCategory(ID_CT: string) {
    await this.prismaService.category.update({
      where: { ID_CT },
      data: { DEL_AT: null },
    });
  }
}
