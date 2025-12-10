import { ApiProperty } from '@nestjs/swagger';

export class RestoreCategoryResponseDto {
  @ApiProperty({ example: 'Categoria restaurada com sucesso' })
  message: string;
}
