import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 12, { message: 'Nome de usuário deve conter no minímo 3 caracteres e no máximo 12' })
    username: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Insira um email em formato válido' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20, { message: 'Senha deve conter no minímo 8 caracteres e no máximo 20' })
    password: string;
}