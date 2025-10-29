import { ApiProperty } from '@nestjs/swagger';
import { QuestionResponseWithDELDto } from './QuestionResponse.dto';

export class CreateQuestionResponseDto {
  @ApiProperty({ example: 'Pergunta criada com sucesso' })
  message: string;

  @ApiProperty({ type: [QuestionResponseWithDELDto] })
  data: QuestionResponseWithDELDto[];
}
