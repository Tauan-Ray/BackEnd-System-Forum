import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { MetaResponseDto } from './AnswerResponse.dto';

class AnswerWithVotes {
  @ApiProperty({ example: '208c1326-e90b-4e75-9432-74e67916a4b2' })
  ID_AN: string;

  @ApiProperty({ example: '208c1326-e90b-4e75-9432-74e67916a4b2' })
  ID_QT: string;

  @ApiProperty({ example: 'Pesquisa' })
  RESPONSE: string;

  @ApiProperty({ example: '2025-10-27T1:58:49.624Z' })
  DT_CR: Date;

  @ApiProperty({ example: '2025-10-27T1:58:49.624Z' })
  DT_UP: Date;

  @ApiProperty({ example: '_tauankk' })
  USERNAME: string;

  @ApiProperty({ example: 'USER' })
  ROLE: UserRole;

  @ApiProperty({ example: 'Como criar projeto em nest js' })
  TITLE: string;

  @ApiProperty({ example: 'Desenvolvimento' })
  CATEGORY: string;

  @ApiProperty({ example: '2025-10-27T1:58:49.624Z' })
  dt_up_user: Date;

  @ApiProperty({ example: null, nullable: true })
  del_at_user: Date | null;

  @ApiProperty({ example: 37 })
  likes: number;

  @ApiProperty({ example: 12 })
  dislikes: number;
}

export class getAnswersByQuestionResponse {
  @ApiProperty({ type: [AnswerWithVotes] })
  _data: AnswerWithVotes[];

  @ApiProperty({ type: [MetaResponseDto] })
  _meta: MetaResponseDto[];
}
