import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UpdateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}