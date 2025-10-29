import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'tauan@example.com' })
  @IsNotEmpty({ message: 'email não deve estar vazio' })
  @IsString()
  @IsEmail({}, { message: 'O e-mail deve estar em um formato válido' })
  email: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty({ message: 'senha não deve estar vazia' })
  @IsString()
  password: string;
}
