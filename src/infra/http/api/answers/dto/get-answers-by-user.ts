import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetAnswersByUserDto {
  @ApiProperty({
    example: 'e8e10cae-9c4c-452d-b6de-85b9076997df',
    description: 'UUID do usuário',
  })
  @IsUUID(undefined, { message: 'O id deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O campo de id não pode estar vazio' })
  id: string;

  @ApiPropertyOptional({
    example: 'Só pesquisar',
    description: 'Conteudo da resposta',
  })
  @IsString()
  @IsOptional()
  search: string;

  @ApiPropertyOptional({
    example: '97541a65-60d8-4c68-b707-2d29452cfe6a',
    description: 'ID da categoria',
  })
  @IsString()
  @IsOptional()
  ID_CT?: string;

  @ApiPropertyOptional({
    example: '2025-11-01T00:00:00Z',
    description: 'Data inicial para filtrar respostas',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  DT_IN?: Date;

  @ApiPropertyOptional({
    example: '2025-11-08T23:59:59Z',
    description: 'Data final para filtrar respostas',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  DT_FM?: Date;

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
