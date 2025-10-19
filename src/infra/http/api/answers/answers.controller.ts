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
import { AnswersService } from './answers.service';
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator';
import type { userPayload } from 'src/common/guards/types';
import {
  CreateAnswerDto,
  FindManyAnswersDto,
  GetIdParamDto,
  UpdateAnswerDto,
  UpdateVoteDto,
} from './dto';
import { RouteAdmin } from 'src/common/decorators/admin.decorator';
import { JwtGuard } from 'src/common/guards';
import { Throttle } from '@nestjs/throttler';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Get('/all')
  @UseGuards(JwtGuard)
  @RouteAdmin()
  async getAllAnswers(@Query() query: FindManyAnswersDto) {
    const answers = await this.answersService.getAllAnswers(query);

    return answers;
  }

  @Get('/find')
  async getAnswerById(@Query('id') id: string) {
    if (!id) throw new BadRequestException('Necessário informar id da resposta');
    const answer = await this.answersService.getAnswerById(id);

    return answer;
  }

  @Get('/user/:id')
  async getAnswerByUser(@Param() idUser: GetIdParamDto, @Query() query: FindManyAnswersDto) {
    const answers = await this.answersService.getAnswersByUser(query, idUser.id);

    return answers;
  }

  @Get('/question/:id')
  async getAnswerByQuestion(
    @Param() idQuestion: GetIdParamDto,
    @Query() query: FindManyAnswersDto,
  ) {
    const answers = await this.answersService.getAnswersByQuestion(query, idQuestion.id);

    return answers;
  }

  @UseGuards(JwtGuard, ThrottlerConfigGuard)
  @Post('/create')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async createAnswer(
    @GetCurrentUser('payload') user: userPayload,
    @Body() createAnswer: CreateAnswerDto,
  ) {
    const answer = await this.answersService.createAnswer(user.sub, createAnswer);

    return answer;
  }

  @UseGuards(JwtGuard, ThrottlerConfigGuard)
  @Patch('/update/:id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async updateAnswer(
    @GetCurrentUser('payload') user: userPayload,
    @Param() id: GetIdParamDto,
    @Body() updateAnswer: UpdateAnswerDto,
  ) {
    const updatedAnswer = await this.answersService.updateAnswer(user, id, updateAnswer);

    return updatedAnswer;
  }

  @UseGuards(JwtGuard, ThrottlerConfigGuard)
  @Patch('delete/:id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async deleteAnswer(@GetCurrentUser('payload') user: userPayload, @Param() id: GetIdParamDto) {
    return await this.answersService.deleteAnswer(user, id);
  }

  @UseGuards(JwtGuard, ThrottlerConfigGuard)
  @Patch('/:id/vote')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async updateVote(
    @GetCurrentUser('payload') user: userPayload,
    @Param() id: GetIdParamDto,
    @Body() updateVote: UpdateVoteDto,
  ) {
    if (!id) throw new BadRequestException('Necessário informar id da resposta');
    const updatedVotes = await this.answersService.updateVotes(user, id, updateVote);

    return updatedVotes;
  }

  @Get('/:id/vote')
  async getVotesByAnswer(@Param() idAnswer: GetIdParamDto) {
    const votesByAnswer = await this.answersService.getVotesByAnswer(idAnswer.id);

    return votesByAnswer;
  }
}
