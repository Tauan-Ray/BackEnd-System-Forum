import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  PrismaAnswersRepository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import {
  CreateAnswerDto,
  FindManyAnswersDto,
  GetAnswersByResourceDto,
  UpdateAnswerDto,
  UpdateVoteDto,
} from './dto';
import { userPayload } from 'src/common/guards/types';

@Injectable()
export class AnswersService {
  constructor(
    private readonly answersRepository: PrismaAnswersRepository,
    private readonly questionsRepository: PrismaQuestionsRepository,
    private readonly usersRepository: PrismaUserRepository,
  ) {}

  async getAllAnswers(query: FindManyAnswersDto) {
    const answers = await this.answersRepository.getAllAnswers(query);

    return answers;
  }

  async getAnswerById(id: string) {
    const answer = await this.answersRepository.getAnswerById(id);

    if (!answer) {
      throw new NotFoundException('Resposta não encontrada');
    }

    return answer;
  }

  async getAnswersByUser(query: GetAnswersByResourceDto) {
    const existingUser = await this.usersRepository.findById(query.id);
    if (!existingUser) throw new NotFoundException('Usuário não encontrado');

    const answers = await this.answersRepository.getAnswersByUser(query);

    return answers;
  }

  async getAnswersByQuestion(query: GetAnswersByResourceDto) {
    const existingQuestion = await this.questionsRepository.getQuestionById(query.id);
    if (!existingQuestion) throw new NotFoundException('Pergunta não encontrada');

    const answers = await this.answersRepository.getAnswersByQuestion(query);

    return answers;
  }

  async createAnswer(idUser: string, createAnswer: CreateAnswerDto) {
    const existingQuestion = await this.questionsRepository.getQuestionById(createAnswer.ID_QT);
    if (!existingQuestion) throw new NotFoundException('Pergunta não encontrada');

    const createdAnswer = await this.answersRepository.createAnswer(idUser, createAnswer);

    return createdAnswer;
  }

  async updateAnswer(user: userPayload, id: string, updateAnswer: UpdateAnswerDto) {
    const existingAnswer = await this.getAnswerById(id);
    if (existingAnswer.ID_USER !== user.sub && user.role !== 'ADMIN')
      throw new UnauthorizedException('Você não pode alterar a respostas de um outro usuário');

    const updatedAnswer = await this.answersRepository.updateAnswer(id, updateAnswer);

    return updatedAnswer;
  }

  async deleteAnswer(user: userPayload, id: string) {
    const existingAnswer = await this.getAnswerById(id);

    if (existingAnswer.ID_USER !== user.sub && user.role !== 'ADMIN')
      throw new UnauthorizedException('Você não pode deletar a respostas de um outro usuário');

    await this.answersRepository.deleteAnswer(id);

    return { message: 'Resposta deletada com sucesso' };
  }

  async updateVotes(user: userPayload, id: string, updateVote: UpdateVoteDto) {
    await this.getAnswerById(id);

    const updatedVote = await this.answersRepository.updateVotes(user.sub, id, updateVote.type);

    return updatedVote;
  }

  async getVotesByAnswer(idAnswer: string) {
    await this.getAnswerById(idAnswer);

    const votesByAnswer = await this.answersRepository.getVotesByAnswer(idAnswer);

    return votesByAnswer;
  }

  async getAllVotesUser(idUser: string) {
    const votesByUser = await this.answersRepository.getAllVotesByUser(idUser);

    return votesByUser;
  }
}
