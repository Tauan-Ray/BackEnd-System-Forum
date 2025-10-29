import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    example: 'Como criar projeto em nest js',
    description: 'Titulo da pergunta',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 60, { message: 'O titulo deve conter no mínimo 5 caracteres e no máximo 60' })
  title: string;

  @ApiProperty({
    example: 'Dicas de como criar projeto em nest js',
    description: 'Descrição da pergunta',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 255, { message: 'A descrição deve conter no mínimo 5 caracteres e no máximo 255' })
  description: string;

  @ApiProperty({
    example: 'e8e10cae-9c4c-452d-b6de-85b9076997df',
    description: 'ID da categoria',
  })
  @IsUUID()
  @IsNotEmpty()
  ID_CT: string;
}
