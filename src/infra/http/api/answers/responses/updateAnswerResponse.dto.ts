import { ApiProperty } from '@nestjs/swagger';

class updatedAnswerModel {
  @ApiProperty({ example: 'f7a8221c-6089-42cf-8cf0-532901738631' })
  ID_AN: string;

  @ApiProperty({ example: 'Pesquisa no youtube' })
  RESPONSE: string;

  @ApiProperty({ example: '2025-10-31T17:21:44.403Z' })
  DT_CR: Date;

  @ApiProperty({ example: '2025-;10-31T17:21:44.403Z' })
  DT_UP: Date;

  @ApiProperty({ example: null })
  DEL_AT: Date | null;

  @ApiProperty({ example: '53103970-7493-4a94-b3e5-9fa72a9164a1' })
  ID_USER: string;

  @ApiProperty({ example: '71e4c72b-d55b-4a43-a03a-dae988ed30a9' })
  ID_QT: string;
}

export class UpdateAnswerResponseDto {
  @ApiProperty({ example: 'Resposta criada com sucesso' })
  message: string;

  @ApiProperty({ type: updatedAnswerModel })
  data: updatedAnswerModel;
}
