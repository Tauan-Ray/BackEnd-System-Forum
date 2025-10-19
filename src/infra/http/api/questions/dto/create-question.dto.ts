import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 60, { message: 'O titulo deve conter no mínimo 5 caracteres e no máximo 60' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 255, { message: 'A descrição deve conter no mínimo 5 caracteres e no máximo 255' })
  description: string;

  @IsUUID()
  @IsNotEmpty()
  ID_CT: string;
}
