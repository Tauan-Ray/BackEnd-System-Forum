import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from './CategoryResponse.dto';

export class CreateCategoryResponseDto {
  @ApiProperty({ example: 'Categoria criada com sucesso' })
  message: string;

  @ApiProperty({ type: [CategoryResponseDto] })
  data: CategoryResponseDto[];
}
