import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: '_tauankk', description: 'Username do usuário para o cadastro' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 12, { message: 'Nome de usuário deve conter no minímo 3 caracteres e no máximo 12' })
  username: string;

  @ApiProperty({ example: 'Tauan Ray', description: 'Nome do usuário para o cadastro' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'tauan@example.com', description: 'Email do usuário para o cadastro' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Insira um email em formato válido' })
  email: string;

  @ApiProperty({ example: 'password', description: 'Senha do usuário para o cadastro' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20, { message: 'Senha deve conter no minímo 8 caracteres e no máximo 20' })
  password: string;
}
