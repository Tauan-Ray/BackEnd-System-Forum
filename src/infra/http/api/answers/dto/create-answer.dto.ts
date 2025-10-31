import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({ example: 'Pesquisa', description: 'Resposta do usuário para a pergunta' })
  @IsString()
  @IsNotEmpty({ message: 'A resposta não pode ser vazia' })
  response: string;

  @ApiProperty({
    example: '480ed6b6-36a1-4acd-b538-2837fdc8a466',
    description: 'UUID da pergunta relacionada a resposta',
  })
  @IsUUID()
  @IsNotEmpty()
  ID_QT: string;
}
