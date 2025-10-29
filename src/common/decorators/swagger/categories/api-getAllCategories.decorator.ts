import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryResponseDto } from 'src/infra/http/api/categories/responses';

export function ApiGetAllCategories() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retorna todas as categorias criadas',
    }),
    ApiResponse({
      status: 200,
      description: 'Retorna todas as categorias',
      type: CategoryResponseDto,
      isArray: true,
    }),
  );
}
