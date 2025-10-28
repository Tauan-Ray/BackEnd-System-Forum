import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({ example: 'actualPassword', description: 'Senha atual do usuário' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: 'Senha atual deve conter no minímo 8 caracteres e no máximo 20' })
  actualPassword: string;
}
