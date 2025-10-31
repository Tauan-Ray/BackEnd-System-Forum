import { ApiProperty } from '@nestjs/swagger';
import { TypeVotes, UserRole } from '@prisma/client';

export class MetaResponseDto {
  @ApiProperty({ example: 3 })
  _results: number;

  @ApiProperty({ example: 3 })
  _total_results: number;

  @ApiProperty({ example: 1 })
  _page: number;

  @ApiProperty({ example: 1 })
  _total_page: number;
}

class UserModel {
  @ApiProperty({ example: '_tauankk' })
  USERNAME: string;

  @ApiProperty({ example: 'USER' })
  ROLE: UserRole;
}

class QuestionModel {
  @ApiProperty({ example: 'Como criar projeto nest js?' })
  TITLE: string;

  @ApiProperty({ example: 'Desenvolvimento' })
  Category: { CATEGORY: string };
}

class VoteModel {
  @ApiProperty({ example: 'LIKE' })
  TYPE: TypeVotes;
}

export class AnswerResponse {
  @ApiProperty({ example: 'ae53a2dd-d8cb-4690-a45c-8b75bcd3b131' })
  ID_AN: string;

  @ApiProperty({ example: 'ae53a2dd-d8cb-4690-a45c-8b75bcd3b131' })
  ID_USER: string;

  @ApiProperty({ example: 'ae53a2dd-d8cb-4690-a45c-8b75bcd3b131' })
  ID_QT: string;

  @ApiProperty({ example: 'Pesquisa' })
  RESPONSE: string;

  VOTES: VoteModel[];

  @ApiProperty({ example: '2025-10-27T16:58:49.624Z' })
  DT_CR: Date;

  @ApiProperty({ example: null })
  DT_AT: Date | null;

  User: UserModel;

  Question: QuestionModel;
}
