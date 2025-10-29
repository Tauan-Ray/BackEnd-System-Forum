import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryResponseDto } from 'src/infra/http/api/categories/responses';

export function ApiGetCategoryById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retorna uma categoria pelo seu ID',
    }),
    ApiResponse({
      status: 200,
      description: 'Retorna a categoria correspondente ao ID',
      type: CategoryResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhuma categoria encontrado' }),
  );
}
