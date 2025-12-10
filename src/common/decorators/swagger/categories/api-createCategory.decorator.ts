import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryResponseDto } from 'src/infra/http/api/categories/responses';

export function ApiCreateCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cria uma nova categoria',
      description: 'Acessivel apenas para users ADMIN',
    }),
    ApiResponse({
      status: 201,
      description: 'Categoria criada com sucesso',
      type: CreateCategoryResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 409, description: 'Categoria com o mesmo nome já existente' }),
  );
}
