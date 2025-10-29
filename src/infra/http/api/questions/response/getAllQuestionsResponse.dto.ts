import { ApiProperty } from '@nestjs/swagger';
import { MetaResponseDto, QuestionResponseDto } from './QuestionResponse.dto';

export class GetAllQuestionsResponseDto {
  @ApiProperty({ type: [QuestionResponseDto] })
  _data: QuestionResponseDto[];

  @ApiProperty({ type: MetaResponseDto })
  _meta: MetaResponseDto;
}
