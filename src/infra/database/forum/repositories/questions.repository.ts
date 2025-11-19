import { Injectable } from '@nestjs/common';
import { PrismaForumService } from '../prisma.forum.service';
import { Prisma } from '@prisma/client';
import {
  CreateQuestionDto,
  FindManyQuestionsDto,
  GetQuestionByUserDto,
} from 'src/infra/http/api/questions/dto';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { UpdateQuestionDto } from 'src/infra/http/api/questions/dto/update-question.dto';

@Injectable()
export class PrismaQuestionsRepository {
  constructor(private readonly prismaService: PrismaForumService) {}

  async getAllQuestions({
    page = 0,
    limit = 10,
    search,
    DT_IN,
    DT_FM,
    ...args
  }: Prisma.QuestionWhereInput & FindManyQuestionsDto) {
    const qry: Prisma.QuestionFindManyArgs<DefaultArgs> = {
      where: {
        DEL_AT: null,
        ...args,
      },
      select: {
        ID_QT: true,
        ID_USER: true,
        ID_CT: true,
        TITLE: true,
        DESCRIPTION: true,
        DT_CR: true,
        Category: { select: { CATEGORY: true } },
        User: { select: { USERNAME: true, ROLE: true } },
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

    if (search) {
      qry.where = {
        ...qry.where,
        OR: [
          {
            TITLE: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            DESCRIPTION: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    const total = await this.prismaService.question.count({ where: qry.where });
    const _data = await this.prismaService.question.findMany(qry);

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

  async getQuestionById(id: string) {
    const question = await this.prismaService.question.findUnique({
      where: { ID_QT: id },
      select: {
        ID_QT: true,
        ID_USER: true,
        ID_CT: true,
        TITLE: true,
        DESCRIPTION: true,
        DT_CR: true,
        DEL_AT: true,
        Category: { select: { CATEGORY: true } },
        User: { select: { USERNAME: true, ROLE: true } },
      },
    });

    return question;
  }

  async getQuestionsByIdUser({
    page = 0,
    limit = 10,
    id,
    search,
    DT_IN,
    DT_FM,
    ...args
  }: GetQuestionByUserDto) {
    const qry: Prisma.QuestionFindManyArgs<DefaultArgs> = {
      where: {
        ID_USER: id,
        ...args,
      },
      select: {
        ID_QT: true,
        ID_USER: true,
        ID_CT: true,
        TITLE: true,
        DESCRIPTION: true,
        DT_CR: true,
        DEL_AT: true,
        Category: { select: { CATEGORY: true } },
        User: { select: { USERNAME: true, ROLE: true } },
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

    if (search) {
      qry.where = {
        ...qry.where,
        OR: [
          {
            TITLE: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            DESCRIPTION: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    const total = await this.prismaService.question.count({ where: qry.where });
    const _data = await this.prismaService.question.findMany(qry);

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

  async createQuestion(idUser: string, data: CreateQuestionDto) {
    const createdQuestion = await this.prismaService.question.create({
      data: {
        ID_USER: idUser,
        TITLE: data.title.trim(),
        DESCRIPTION: data.description.trim(),
        ID_CT: data.ID_CT,
      },
    });

    return {
      message: 'Pergunta criada com sucesso',
      data: createdQuestion,
    };
  }

  async updateQuestion(id: string, data: UpdateQuestionDto) {
    const updatedQuestion = await this.prismaService.question.update({
      where: {
        ID_QT: id,
      },
      data: {
        ...(data.title && { TITLE: data.title }),
        ...(data.description && { DESCRIPTION: data.description }),
        ...(data.ID_CT && { ID_CT: data.ID_CT }),
      },
    });

    return {
      message: 'Pergunta editada com sucesso',
      data: updatedQuestion,
    };
  }

  async deleteQuestion(id: string) {
    await this.prismaService.question.update({
      where: {
        ID_QT: id,
      },
      data: {
        DEL_AT: new Date(),
      },
    });
  }
}
