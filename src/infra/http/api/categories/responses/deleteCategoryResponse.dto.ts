import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryResponseDto {
  @ApiProperty({ example: 'Categoria deletada com sucesso' })
  message: string;
}
