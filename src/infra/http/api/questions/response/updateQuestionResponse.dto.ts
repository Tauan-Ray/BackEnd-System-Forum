import { ApiProperty } from '@nestjs/swagger';
import { QuestionResponseWithDELDto } from './QuestionResponse.dto';

export class UpdateQuestionResponseDto {
  @ApiProperty({ example: 'Pergunta editada com sucesso' })
  message: string;

  @ApiProperty({ type: [QuestionResponseWithDELDto] })
  data: QuestionResponseWithDELDto[];
}
