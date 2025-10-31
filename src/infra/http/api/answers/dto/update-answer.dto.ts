import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAnswerDto {
  @ApiProperty({ example: 'Documentação', description: 'Novo conteúdo da resposta' })
  @IsString()
  @IsNotEmpty({ message: 'A resposta não pode ser vazia' })
  response: string;
}
