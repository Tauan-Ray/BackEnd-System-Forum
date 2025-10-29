import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindManyQuestionsDto {
  @ApiPropertyOptional({
    example: 'e8e10cae-9c4c-452d-b6de-85b9076997df',
    description: 'ID da pergunta',
  })
  @IsUUID()
  @IsOptional()
  ID_QT?: string;

  @ApiPropertyOptional({
    example: 'Como criar projeto em nest js',
    description: 'Titulo da pergunta',
  })
  @IsString()
  @IsOptional()
  TITLE?: string;

  @ApiPropertyOptional({
    example: 'Dicas de como criar projeto em nest js',
    description: 'Descrição da pergunta',
  })
  @IsString()
  @IsOptional()
  DESCRIPTION?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Página atual (paginação)',
  })
  @IsOptional()
  @Transform(({ value }) => (Number.isInteger(Number(value)) ? Number(value) : undefined))
  @IsInt()
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Quantidade de itens por página',
  })
  @IsOptional()
  @Transform(({ value }) => (Number.isInteger(Number(value)) ? Number(value) : undefined))
  @IsInt()
  limit?: number;
}
