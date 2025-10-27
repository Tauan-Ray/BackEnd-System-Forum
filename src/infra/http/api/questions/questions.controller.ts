import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtGuard, ThrottlerConfigGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator';
import type { userPayload } from 'src/common/guards/types';
import {
  CreateQuestionDto,
  FindManyQuestionsDto,
  GetIdParamDto,
  GetQuestionByUserDto,
} from './dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('/all')
  async getAllQuestions(@Query() query: FindManyQuestionsDto) {
    const questions = await this.questionsService.getAllQuestions(query);

    return questions;
  }

  @Get('/find')
  async getQuestionById(@Query() query: GetIdParamDto) {
    const question = await this.questionsService.getQuestionById(query.id);

    return question;
  }

  @Get('/user/')
  async getQuestionsByIdUser(@Query() query: GetQuestionByUserDto) {
    const questions = await this.questionsService.getQuestionsByIdUser(query);

    return questions;
  }

  @UseGuards(JwtGuard, ThrottlerConfigGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('/create')
  async createQuestion(
    @GetCurrentUser('payload') user: userPayload,
    @Body() data: CreateQuestionDto,
  ) {
    const createdQuestion = await this.questionsService.createQuestion(user.sub, data);

    return createdQuestion;
  }

  @UseGuards(JwtGuard, ThrottlerConfigGuard)
  @Patch('/update/:id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async updateQuestion(
    @GetCurrentUser('payload') user: userPayload,
    @Param() id: GetIdParamDto,
    @Body() data: UpdateQuestionDto,
  ) {
    const updatedQuestion = await this.questionsService.updateQuestion(user, id.id, data);

    return updatedQuestion;
  }

  @UseGuards(JwtGuard, ThrottlerConfigGuard)
  @Patch('/delete/:id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async deleteQuestion(@GetCurrentUser('payload') user: userPayload, @Param() id: GetIdParamDto) {
    return await this.questionsService.deleteQuestion(id.id, user);
  }
}
