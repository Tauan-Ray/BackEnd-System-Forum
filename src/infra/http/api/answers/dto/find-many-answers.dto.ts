import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindManyAnswersDto {
  @IsOptional()
  @Transform(({ value }) => Number(value) || null)
  @IsInt()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value) || null)
  @IsInt()
  limit?: number;
}
