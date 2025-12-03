import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

class CategoryModel {
  @ApiProperty({ example: 'Desenvolvimento' })
  CATEGORY: string;
}

class UserModel {
  @ApiProperty({ example: '_tauankk' })
  USERNAME: string;

  @ApiProperty({ example: 'USER' })
  ROLE: UserRole;

  @ApiProperty({ example: '2025-10-27T1:58:49.624Z' })
  DT_UP: Date;

  @ApiProperty({ example: null, nullable: true })
  DEL_AT: Date | null;
}

export class QuestionResponseDto {
  @ApiProperty({ example: '28449edc-aa8f-4557-99c0-0c7b424ae827' })
  ID_QT: string;

  @ApiProperty({ example: '28449edc-aa8f-4557-99c0-0c7b424ae827' })
  ID_USER: string;

  @ApiProperty({ example: '28449edc-aa8f-4557-99c0-0c7b424ae827' })
  ID_CT: string;

  @ApiProperty({ example: 'Como criar um projeto nest js?' })
  TITLE: string;

  @ApiProperty({ example: 'Dicas de como criar projeto em nest js' })
  DESCRIPTION: string;

  @ApiProperty({ example: '2025-10-24T19:26:43.011Z' })
  DT_CR: Date;

  @ApiProperty({ example: '2025-10-24T19:26:43.011Z' })
  DT_UP: Date;

  @ApiProperty({ type: CategoryModel })
  Category: CategoryModel;

  @ApiProperty({ type: UserModel })
  User: UserModel;
}

export class QuestionResponseWithDELDto extends QuestionResponseDto {
  @ApiProperty({ example: null, nullable: true })
  DEL_AT: Date | null;
}

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
