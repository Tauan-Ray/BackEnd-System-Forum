import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: 'Senha atual deve conter no minímo 8 caracteres e no máximo 20' })
  actualPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: 'A nova senha deve conter no minímo 8 caracteres e no máximo 20' })
  newPassword: string;
}
