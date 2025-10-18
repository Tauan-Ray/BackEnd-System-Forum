import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { JwtGuard } from "src/common/guards";
import { GetCurrentUser } from "src/common/decorators/getCurrentUser.decorator";
import type { userPayload } from "src/common/guards/types";
import { CreateQuestionDto, FindManyQuestionsDto } from "./dto";
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
        const question = await this.questionsService.getQuestionById(query.id_question)

        return question;
    }

    @Get('/user/:id')
    async getQuestionsByIdUser(@Param('id') id: string) {
        const questions = await this.questionsService.getQuestionsByUserId(id);

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
    async updateQuestion(@GetCurrentUser('payload') user: userPayload, @Param('id') id: string, @Body() data: UpdateQuestionDto) {
        const updatedQuestion = await this.questionsService.updateQuestion(user, id, data)

        return updatedQuestion;
    }

    @UseGuards(JwtGuard)
    @Patch('/delete/:id')
    async deleteQuestion(@GetCurrentUser('payload') user: userPayload, @Param('id') id: string) {
        return await this.questionsService.deleteQuestion(id, user)
    }

}