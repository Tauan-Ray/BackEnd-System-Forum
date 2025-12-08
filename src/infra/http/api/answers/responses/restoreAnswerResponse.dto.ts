import { ApiProperty } from '@nestjs/swagger';

export class RestoreAnswerResponseDto {
  @ApiProperty({ example: 'Resposta restaurada com sucesso' })
  message: string;
}
