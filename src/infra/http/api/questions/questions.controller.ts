import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { JwtGuard } from "src/common/guards";
import { GetCurrentUser } from "src/common/decorators/getCurrentUser.decorator";
import type { userPayload } from "src/common/guards/types";
import { CreateQuestionDto, FindManyQuestionsDto, GetIdParamDto } from "./dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";

@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) {}

    @Get('/all')
    async getAllQuestions(@Query() query: FindManyQuestionsDto) {
        const questions = await this.questionsService.getAllQuestions(query);

        return questions;
    }

    @Get('/find')
    async getQuestionById(@Query() query: { id_question: string }) {
        if (!query.id_question) throw new BadRequestException('Necessário informar id da pergunta')
        const question = await this.questionsService.getQuestionById(query.id_question)

        return question;
    }

    @Get('/user/:id')
    async getQuestionsByIdUser(@Param('id') idUser: GetIdParamDto) {
        if (!idUser) throw new BadRequestException('Necessário informar id da resposta')
        const questions = await this.questionsService.getQuestionsByUserId(idUser.id);

        return questions
    }

    @UseGuards(JwtGuard)
    @Post('/create')
    async createQuestion(@GetCurrentUser('payload') user: userPayload, @Body() data: CreateQuestionDto) {
        const createdQuestion = await this.questionsService.createQuestion(user.sub, data)

        return createdQuestion;
    }

    @UseGuards(JwtGuard)
    @Patch('/update/:id')
    async updateQuestion(@GetCurrentUser('payload') user: userPayload, @Param('id') id: GetIdParamDto, @Body() data: UpdateQuestionDto) {
        const updatedQuestion = await this.questionsService.updateQuestion(user, id.id, data)

        return updatedQuestion;
    }

    @UseGuards(JwtGuard)
    @Patch('/delete/:id')
    async deleteQuestion(@GetCurrentUser('payload') user: userPayload, @Param('id') id: GetIdParamDto) {
        return await this.questionsService.deleteQuestion(id.id, user)
    }

}