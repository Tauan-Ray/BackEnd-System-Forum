import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty({ message: 'email não deve estar vazio' })
  @IsString()
  @IsEmail({}, { message: 'O e-mail deve estar em um formato válido' })
  email: string;

  @IsNotEmpty({ message: 'senha não deve estar vazia' })
  @IsString()
  password: string;
}
