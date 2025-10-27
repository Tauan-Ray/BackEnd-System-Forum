import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty({ message: 'A resposta não pode ser vazia' })
  response: string;

  @IsUUID()
  @IsNotEmpty()
  ID_QT: string;
}
