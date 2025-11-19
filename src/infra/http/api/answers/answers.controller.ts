import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator';
import type { userPayload } from 'src/common/guards/types';
import {
  CreateAnswerDto,
  FindManyAnswersDto,
  GetAnswersByResourceDto,
  GetAnswersByUserDto,
  GetIdParamDto,
  UpdateAnswerDto,
  UpdateVoteDto,
} from './dto';
import { RouteAdmin } from 'src/common/decorators/admin.decorator';
import { JwtGuard } from 'src/common/guards';
import { Throttle } from '@nestjs/throttler';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiForbiddenResponse } from 'src/common/decorators/swagger/api-forbiddenResponse.decorator';
import {
  ApiCreateAnswer,
  ApiDeleteAnswer,
  ApiGetAllAnswers,
  ApiGetAllVotesUser,
  ApiGetAnswerById,
  ApiGetAnswerByIdUser,
  ApiGetAnswerByQuestion,
  ApiGetVotesByAnswer,
  ApiUpdateAnswer,
  ApiUpdateVotes,
} from 'src/common/decorators/swagger/answers';

@ApiTags('Answers')
@ApiResponse({ status: 500, description: 'Erro interno no servidor' })
@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Get('/all')
  @RouteAdmin()
  @UseGuards(JwtGuard)
  @ApiForbiddenResponse()
  @ApiGetAllAnswers()
  async getAllAnswers(@Query() query: FindManyAnswersDto) {
    const answers = await this.answersService.getAllAnswers(query);

    return answers;
  }

  @Get('/find')
  @ApiGetAnswerById()
  async getAnswerById(@Query() idAnswer: GetIdParamDto) {
    const answer = await this.answersService.getAnswerById(idAnswer.id);

    return answer;
  }

  @Get('/user/')
  @ApiGetAnswerByIdUser()
  async getAnswersByUser(@Query() query: GetAnswersByUserDto) {
    const answers = await this.answersService.getAnswersByUser(query);

    return answers;
  }

  @Get('/question/')
  @ApiGetAnswerByQuestion()
  async getAnswersByQuestion(@Query() query: GetAnswersByResourceDto) {
    const answers = await this.answersService.getAnswersByQuestion(query);

    return answers;
  }

  @UseGuards(JwtGuard, ThrottlerConfigGuard)
  @Post('/create')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiCreateAnswer()
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
  @ApiUpdateAnswer()
  async updateAnswer(
    @GetCurrentUser('payload') user: userPayload,
    @Param() answerId: GetIdParamDto,
    @Body() updateAnswer: UpdateAnswerDto,
  ) {
    const updatedAnswer = await this.answersService.updateAnswer(user, answerId.id, updateAnswer);

    return updatedAnswer;
  }

  @UseGuards(JwtGuard, ThrottlerConfigGuard)
  @Patch('delete/:id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiDeleteAnswer()
  async deleteAnswer(
    @GetCurrentUser('payload') user: userPayload,
    @Param() answerId: GetIdParamDto,
  ) {
    return await this.answersService.deleteAnswer(user, answerId.id);
  }

  @UseGuards(JwtGuard, ThrottlerConfigGuard)
  @Patch('/:id/vote')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiUpdateVotes()
  async updateVotes(
    @GetCurrentUser('payload') user: userPayload,
    @Param() answerId: GetIdParamDto,
    @Body() updateVote: UpdateVoteDto,
  ) {
    const updatedVotes = await this.answersService.updateVotes(user, answerId.id, updateVote);

    return updatedVotes;
  }

  @Get('/:id/vote')
  @ApiGetVotesByAnswer()
  async getVotesByAnswer(@Param() idAnswer: GetIdParamDto) {
    const votesByAnswer = await this.answersService.getVotesByAnswer(idAnswer.id);

    return votesByAnswer;
  }

  @Get('user/:id/vote')
  @UseGuards(JwtGuard)
  @ApiGetAllVotesUser()
  async getAllVotesUser(@GetCurrentUser('payload') user: userPayload) {
    const allVotesUser = await this.answersService.getAllVotesUser(user.sub);

    return allVotesUser;
  }
}
