import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RestoreQuestionResponseDto } from 'src/infra/http/api/questions/response';

export function ApiRestoreQuestion() {
  return applyDecorators(
    ApiOperation({
      summary: 'Restaura uma pergunta deletada',
      description: 'Acessivel apenas para users ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: 'Pergunta restaurada com sucesso',
      type: RestoreQuestionResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhuma pergunta encontrada' }),
    ApiResponse({ status: 422, description: 'A pergunta não está com o status de deletada' }),
  );
}
