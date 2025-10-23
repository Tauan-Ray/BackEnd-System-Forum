import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da categoria não pode estar vazio' })
  @Length(3, 45, {
    message: 'O nome da categoria deve conter no minímo 3 caracteres e no máximo 45',
  })
  name: string;
}
