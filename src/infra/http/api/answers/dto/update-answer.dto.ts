import { IsNotEmpty, IsString } from "class-validator";

export class UpdateAnswerDto {
    @IsString()
    @IsNotEmpty()
    response: string;
}