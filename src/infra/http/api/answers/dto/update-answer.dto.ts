import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAnswerDto {
  @IsString()
  @IsNotEmpty({ message: 'A resposta não pode ser vazia' })
  response: string;
}
