import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class UpdateQuestionDto {
  @ApiPropertyOptional({
    example: 'Como criar projeto em nest js',
    description: 'Titulo da pergunta',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(5, 60, { message: 'O titulo deve conter no mínimo 5 caracteres e no máximo 60' })
  title?: string;

  @ApiPropertyOptional({
    example: 'Dicas de como criar projeto em nest js',
    description: 'Descrição da pergunta',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(5, 255, { message: 'A descrição deve conter no mínimo 5 caracteres e no máximo 255' })
  description?: string;

  @ApiPropertyOptional({
    example: 'e8e10cae-9c4c-452d-b6de-85b9076997df',
    description: 'ID da categoria',
  })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  ID_CT?: string;
}
