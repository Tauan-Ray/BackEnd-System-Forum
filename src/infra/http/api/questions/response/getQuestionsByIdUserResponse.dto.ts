import { ApiProperty } from '@nestjs/swagger';
import { MetaResponseDto, QuestionResponseWithDELDto } from './QuestionResponse.dto';

export class GetQuestionsByIdUserDto {
  @ApiProperty({ type: [QuestionResponseWithDELDto] })
  _data: QuestionResponseWithDELDto[];

  @ApiProperty({ type: MetaResponseDto })
  _meta: MetaResponseDto;
}
