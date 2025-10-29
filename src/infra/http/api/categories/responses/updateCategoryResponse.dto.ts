import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from './CategoryResponse.dto';

export class UpdateCategoryResponseDto {
  @ApiProperty({ example: 'Categoria atualizada com sucesso' })
  message: string;

  @ApiProperty({ type: [CategoryResponseDto] })
  data: CategoryResponseDto[];
}
