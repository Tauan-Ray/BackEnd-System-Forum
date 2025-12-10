import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RestoreQuestionResponseDto } from 'src/infra/http/api/questions/response';

export function ApiRestoreCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Restaura uma categoria deletada',
      description: 'Acessivel apenas para users ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: 'Categoria restaurada com sucesso',
      type: RestoreQuestionResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhuma categoria encontrada' }),
    ApiResponse({ status: 422, description: 'A categoria não está com o status de deletada' }),
  );
}
