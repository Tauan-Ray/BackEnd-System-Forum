import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Tauankk', description: 'Novo username de usuário' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 12, { message: 'Nome de usuário deve conter no minímo 3 caracteres e no máximo 12' })
  @IsOptional()
  username: string;

  @ApiPropertyOptional({ example: 'Tauan-Ray', description: 'Novo nome de usuário' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: 'tauan2@example.com', description: 'Novo email do usuário' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Insira um email em formato válido' })
  @IsOptional()
  email: string;
}
