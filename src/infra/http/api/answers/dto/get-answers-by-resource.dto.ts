import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class GetAnswersByResourceDto {
  @IsUUID(undefined, { message: 'O id deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O campo de id não pode estar vazio' })
  id: string;

  @IsOptional()
  @Transform(({ value }) => (Number.isInteger(Number(value)) ? Number(value) : undefined))
  @IsInt()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => (Number.isInteger(Number(value)) ? Number(value) : undefined))
  @IsInt()
  limit?: number;
}
