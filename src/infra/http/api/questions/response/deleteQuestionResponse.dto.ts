import { ApiProperty } from '@nestjs/swagger';

export class DeleteQuestionResponseDto {
  @ApiProperty({ example: 'Pergunta deletada com sucesso' })
  message: string;
}
