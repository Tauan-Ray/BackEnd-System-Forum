import { Injectable } from '@nestjs/common';
import { PrismaForumService } from '../prisma.forum.service';
import { CreateAnswerDto, UpdateAnswerDto } from 'src/infra/http/api/answers/dto';
import { TypeVotes } from 'src/infra/http/api/answers/dto/update-vote.dto';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaAnswersRepository {
  constructor(private readonly prismaService: PrismaForumService) {}

  async getAllAnswers({ page = 0, limit = 10 }) {
    const qry: Prisma.AnswerFindManyArgs<DefaultArgs> = {
      where: { DEL_AT: null },
      select: {
        ID_AN: true,
        ID_USER: true,
        ID_QT: true,
        RESPONSE: true,
        VOTES: true,
        DT_CR: true,
        DEL_AT: true,
        User: { select: { USERNAME: true, ROLE: true } },
        Question: { select: { TITLE: true, Category: { select: { CATEGORY: true } } } },
      },
      skip: page * limit,
      take: limit,
      orderBy: {
        DT_UP: 'desc',
      },
    };

    const total = await this.prismaService.answer.count();
    const _data = await this.prismaService.answer.findMany(qry);

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

  async getAnswerById(id: string) {
    const answer = await this.prismaService.answer.findUnique({
      where: { ID_AN: id, DEL_AT: null },
      select: {
        ID_AN: true,
        ID_USER: true,
        ID_QT: true,
        RESPONSE: true,
        VOTES: true,
        DT_CR: true,
        DEL_AT: true,
        User: { select: { USERNAME: true, ROLE: true } },
        Question: { select: { TITLE: true, Category: { select: { CATEGORY: true } } } },
      },
    });

    return answer;
  }

  async getAnswersByUser({ page = 0, limit = 10, id }) {
    const qry: Prisma.AnswerFindManyArgs<DefaultArgs> = {
      where: { ID_USER: id, DEL_AT: null },
      select: {
        ID_AN: true,
        ID_USER: true,
        ID_QT: true,
        RESPONSE: true,
        VOTES: true,
        DT_CR: true,
        DEL_AT: true,
        User: { select: { USERNAME: true, ROLE: true } },
        Question: { select: { TITLE: true, Category: { select: { CATEGORY: true } } } },
      },
      skip: page * limit,
      take: limit,
      orderBy: {
        DT_UP: 'desc',
      },
    };

    const total = await this.prismaService.answer.count({ where: qry.where });
    const _data = await this.prismaService.answer.findMany(qry);

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

  async getAnswersByQuestion({ page = 0, limit = 10, id }) {
    const results = await this.prismaService.$queryRaw<
      Array<{
        ID_AN: string;
        RESPONSE: string;
        DT_CR: Date;
        USERNAME: string;
        ROLE: string;
        TITLE: string;
        CATEGORY: string;
        likes: number;
        dislikes: number;
      }>
    >`
            SELECT
                a."ID_AN",
                a."ID_QT",
                a."RESPONSE",
                a."DT_CR",
                u."USERNAME",
                u."ROLE",
                q."TITLE",
                c."CATEGORY",
                CAST(COUNT(CASE WHEN v."TYPE" = 'LIKE' THEN 1 END) AS INT) AS likes,
                CAST(COUNT(CASE WHEN v."TYPE" = 'DESLIKE' THEN 1 END) AS INT) AS dislikes
            FROM
                "ANSWERS" a
            JOIN "USERS" u ON
                u."ID_USER" = a."ID_USER"
            JOIN "QUESTIONS" q ON
                q."ID_QT" = a."ID_QT"
            JOIN "CATEGORIES" c ON
                c."ID_CT" = q."ID_CT"
            LEFT JOIN "VOTES" v ON
                v."ID_AN" = a."ID_AN"
            WHERE
                a."ID_QT" = ${id}
            GROUP BY
                a."ID_AN",
                u."USERNAME",
                u."ROLE",
                q."TITLE",
                c."CATEGORY"
            ORDER BY
                likes DESC
                OFFSET ${page * limit}
            LIMIT ${limit};
        `;

    const total = await this.prismaService.answer.count({
      where: { ID_QT: id, DEL_AT: null },
    });

    return {
      _data: results,
      _meta: {
        _results: results.length,
        _total_results: total,
        _page: page + 1,
        _total_page: Math.ceil(total / limit),
      },
    };
  }

  async createAnswer(idUser: string, data: CreateAnswerDto) {
    const answer = await this.prismaService.answer.create({
      data: {
        ID_USER: idUser,
        RESPONSE: data.response,
        ID_QT: data.ID_QT,
      },
    });

    return {
      message: 'Resposta criada com sucesso',
      data: answer,
    };
  }

  async updateAnswer(id: string, data: UpdateAnswerDto) {
    const updatedAnswer = await this.prismaService.answer.update({
      where: { ID_AN: id },
      data: {
        RESPONSE: data.response,
      },
    });

    return {
      message: 'Resposta atualizada com sucesso',
      data: updatedAnswer,
    };
  }

  async deleteAnswer(id: string) {
    await this.prismaService.answer.update({
      where: {
        ID_AN: id,
      },
      data: {
        DEL_AT: new Date(),
      },
    });
  }

  async updateVotes(idUser: string, idAnswer: string, type: TypeVotes) {
    const existingVote = await this.prismaService.vote.findUnique({
      where: {
        ID_USER_ID_AN: { ID_USER: idUser, ID_AN: idAnswer },
      },
    });

    if (existingVote && existingVote.TYPE === type) {
      await this.prismaService.vote.delete({
        where: { ID_USER_ID_AN: { ID_USER: idUser, ID_AN: idAnswer } },
      });

      return { message: 'Voto removido' };
    }

    if (existingVote) {
      await this.prismaService.vote.update({
        where: { ID_USER_ID_AN: { ID_USER: idUser, ID_AN: idAnswer } },
        data: { TYPE: type },
      });

      return { message: 'Voto atualizado' };
    }

    await this.prismaService.vote.create({
      data: {
        ID_USER: idUser,
        ID_AN: idAnswer,
        TYPE: type,
      },
    });

    return { message: 'Voto criado' };
  }

  async getVotesByAnswer(idAnswer: string) {
    const likes = await this.prismaService.vote.count({
      where: { ID_AN: idAnswer, TYPE: 'LIKE' },
    });

    const deslikes = await this.prismaService.vote.count({
      where: { ID_AN: idAnswer, TYPE: 'DESLIKE' },
    });

    return {
      ID_AN: idAnswer,
      LIKES: likes,
      DESLIKES: deslikes,
    };
  }
}
