import { IsNotEmpty, IsUUID } from "class-validator";

export class getUserDto {
    @IsNotEmpty()
    @IsUUID()
    userId: string;
}