import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateCategoryResponseDto } from 'src/infra/http/api/categories/responses';

export function ApiUpdateCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualiza uma categoria existente',
      description: 'Acessivel apenas para users ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: 'Categoria atualizada com sucesso',
      type: UpdateCategoryResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhuma categoria encontrado' }),
    ApiResponse({ status: 409, description: 'Categoria com o mesmo nome já existente' }),
  );
}
