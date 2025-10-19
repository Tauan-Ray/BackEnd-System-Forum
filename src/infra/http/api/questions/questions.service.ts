import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { userPayload } from 'src/common/guards/types';
import {
  PrismaCategoryRespotiory,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { CreateQuestionDto, FindManyQuestionsDto } from './dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionsRepository: PrismaQuestionsRepository,
    private readonly categoryRepository: PrismaCategoryRespotiory,
    private readonly userRepository: PrismaUserRepository,
  ) {}

  async getAllQuestions(args: FindManyQuestionsDto) {
    const questions = await this.questionsRepository.getAllQuestions(args);

    return questions;
  }

  async getQuestionById(id: string) {
    const questionById = await this.questionsRepository.getQuestionById(id);

    if (!questionById) {
      throw new NotFoundException('Pergunta não encontrada');
    }

    return questionById;
  }

  async getQuestionsByUserId(idUser: string) {
    const existingUser = await this.userRepository.findById(idUser);
    if (!existingUser) throw new NotFoundException('Usuário não encontrado');

    const questions = await this.questionsRepository.getQuestionsByidUser(idUser);

    return questions;
  }

  async createQuestion(idUser: string, data: CreateQuestionDto) {
    const existingCategory = await this.categoryRepository.getCategoryById(data.ID_CT);
    if (!existingCategory) throw new NotFoundException('Categoria não encontrada');

    const createdQuestion = await this.questionsRepository.createQuestion(idUser, data);

    return createdQuestion;
  }

  async updateQuestion(user: userPayload, idQuestion: string, data: UpdateQuestionDto) {
    const existingQuestion = await this.getQuestionById(idQuestion);
    if (data.ID_CT) {
      const existingCategory = await this.categoryRepository.getCategoryById(data.ID_CT);
      if (!existingCategory) throw new NotFoundException('Categoria não encontrada');
    }

    if (!existingQuestion) throw new NotFoundException('Pergunta não encontrada');
    if (existingQuestion.ID_USER !== user.sub && user.role !== 'ADMIN')
      throw new UnauthorizedException('Você não pode alterar uma pergunta de outra pessoa');

    const updatedQuestion = await this.questionsRepository.updateQuestion(idQuestion, data);

    return updatedQuestion;
  }

  async deleteQuestion(idQuestion: string, user: userPayload) {
    const existingQuestion = await this.getQuestionById(idQuestion);

    if (existingQuestion.ID_USER !== user.sub && user.role !== 'ADMIN')
      throw new UnauthorizedException('Você não pode deletar uma pergunta de outra pessoa');

    await this.questionsRepository.deleteQuestion(idQuestion);

    return { message: 'Pergunta deletada com sucesso!' };
  }
}
