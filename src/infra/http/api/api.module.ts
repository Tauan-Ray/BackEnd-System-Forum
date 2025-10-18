import { Module } from "@nestjs/common";
import { CategoriesModule } from "./categories/categories.module";
import { QuestionsModule } from "./questions/questions.module";

@Module({
    imports: [CategoriesModule, QuestionsModule]
})
export class ApiModule {} ;