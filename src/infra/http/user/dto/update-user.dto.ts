import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 12, { message: 'Nome de usuário deve conter no minímo 3 caracteres e no máximo 12' })
  @IsOptional()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Insira um email em formato válido' })
  @IsOptional()
  email: string;
}
