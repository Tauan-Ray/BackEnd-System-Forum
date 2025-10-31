import { ApiProperty } from '@nestjs/swagger';

export class DeleteAnswerResponseDto {
  @ApiProperty({ example: 'Resposta deletada com sucesso' })
  message: string;
}
