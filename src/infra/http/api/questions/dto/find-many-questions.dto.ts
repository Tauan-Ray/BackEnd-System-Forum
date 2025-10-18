import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, IsUUID } from "class-validator";

export class FindManyQuestionsDto {
    @IsUUID()
    @IsOptional()
    ID_QT?: string;

    @IsString()
    @IsOptional()
    TITLE?: string;

    @IsString()
    @IsOptional()
    DESCRIPTION?: string

    @IsOptional()
    @Transform(({ value }) => Number(value) || null)
    @IsInt()
    page?: number;

    @IsOptional()
    @Transform(({ value }) => Number(value) || null)
    @IsInt()
    limit?: number;
}