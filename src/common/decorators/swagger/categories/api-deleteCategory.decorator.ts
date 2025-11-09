import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeleteCategoryResponseDto } from 'src/infra/http/api/categories/responses';

export function ApiDeleteCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Deleta uma categoria existente (soft delete)',
      description: 'Acessivel apenas para users ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: 'Categoria deletada com sucesso',
      type: DeleteCategoryResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhuma categoria encontrado' }),
  );
}
