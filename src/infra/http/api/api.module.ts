import { Module } from "@nestjs/common";
import { CategoriesModule } from "./categories/categories.module";
import { QuestionsModule } from "./questions/questions.module";
import { AnswersModule } from "./answers/answers.module";

@Module({
    imports: [CategoriesModule, QuestionsModule, AnswersModule]
})
export class ApiModule {} ;