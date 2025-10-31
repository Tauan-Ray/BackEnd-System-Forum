import { ApiProperty } from '@nestjs/swagger';
import { AnswerResponse, MetaResponseDto } from './AnswerResponse.dto';

export class GetManyAnswersResponse {
  @ApiProperty({ type: [AnswerResponse] })
  _data: AnswerResponse[];

  @ApiProperty({ type: [MetaResponseDto] })
  _meta: MetaResponseDto;
}
