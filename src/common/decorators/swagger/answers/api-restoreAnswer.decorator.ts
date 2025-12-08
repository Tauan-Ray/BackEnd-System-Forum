import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RestoreAnswerResponseDto } from 'src/infra/http/api/answers/responses';

export function ApiRestoreAnswer() {
  return applyDecorators(
    ApiOperation({
      summary: 'Restaura uma resposta deletada',
      description: 'Acessivel apenas para users ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: 'Resposta restaurada com sucesso',
      type: RestoreAnswerResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhuma resposta encontrada' }),
    ApiResponse({ status: 422, description: 'A resposta não está com o status de deletada' }),
  );
}
