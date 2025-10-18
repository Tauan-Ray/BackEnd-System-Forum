import { IsNotEmpty, IsUUID } from "class-validator";

export class GetIdParamDto {
    @IsUUID()
    @IsNotEmpty({ message: 'O campo de id é obrigatório' })
    id: string
}