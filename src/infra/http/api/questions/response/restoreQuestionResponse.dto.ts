import { ApiProperty } from '@nestjs/swagger';

export class RestoreQuestionResponseDto {
  @ApiProperty({ example: 'Pergunta restaurada com sucesso' })
  message: string;
}
