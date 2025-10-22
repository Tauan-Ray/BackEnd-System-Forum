import { Transform } from 'class-transformer';
import { IsEmail, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindManyUserDto {
  @IsOptional()
  @IsUUID()
  ID_USER?: string;

  @IsOptional()
  @IsEmail()
  EMAIL?: string;

  @IsOptional()
  @IsString()
  USERNAME?: string;

  @IsOptional()
  @IsString()
  NAME?: string;

  @IsOptional()
  @Transform(({ value }) => (Number.isInteger(Number(value)) ? Number(value) : undefined))
  @IsInt()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => (Number.isInteger(Number(value)) ? Number(value) : undefined))
  @IsInt()
  limit?: number;
}
