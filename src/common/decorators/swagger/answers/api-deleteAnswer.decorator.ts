import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeleteAnswerResponseDto } from 'src/infra/http/api/answers/responses';

export function ApiDeleteAnswer() {
  return applyDecorators(
    ApiOperation({
      summary: 'Deleta uma resposta (soft delete)',
    }),
    ApiResponse({
      status: 200,
      description: 'Resposta deletada com sucesso',
      type: DeleteAnswerResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 401, description: 'Você não pode deletar a resposta de outro usuário' }),
    ApiResponse({ status: 404, description: 'Resposta não encontrada' }),
    ApiResponse({ status: 429, description: 'Too Many Requests' }),
  );
}
