import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindManyUserDto {
  @ApiPropertyOptional({
    example: '21408dd4-060e-4ec8-8748-c163a756a493',
    description: 'Filtra pelo ID do usuário',
  })
  @IsOptional()
  @IsUUID()
  ID_USER?: string;

  @ApiPropertyOptional({
    example: 'tauan@example.com',
    description: 'Filtra pelo email do usuário',
  })
  @IsOptional()
  @IsEmail()
  EMAIL?: string;

  @ApiPropertyOptional({
    example: '_tauankk',
    description: 'Filtra pelo username do usuário',
  })
  @IsOptional()
  @IsString()
  USERNAME?: string;

  @ApiPropertyOptional({
    example: 'Tauan Ray',
    description: 'Filtra pelo nome do usuário',
  })
  @IsOptional()
  @IsString()
  NAME?: string;

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
