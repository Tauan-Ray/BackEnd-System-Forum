import { ApiProperty } from '@nestjs/swagger';
import { MetaResponseDto } from './AnswerResponse.dto';

class AllAnswers {
  ID_AN: string;
  RESPONSE: string;
  DT_CR: Date;
  DT_UP: Date;
  DEL_AT: Date | null;
  USERNAME: string;
  ROLE: string;
  TITLE: string;
  CATEGORY: string;
  likes: number;
  dislikes: number;
  user_vote: 'LIKE' | 'DESLIKE' | null;
  dt_up_user: Date;
}

export class GetManyAnswersResponse {
  @ApiProperty({ type: [AllAnswers] })
  _data: AllAnswers[];

  @ApiProperty({ type: [MetaResponseDto] })
  _meta: MetaResponseDto;
}
