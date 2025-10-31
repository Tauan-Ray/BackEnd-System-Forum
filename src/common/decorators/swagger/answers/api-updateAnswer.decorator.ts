import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateAnswerResponseDto } from 'src/infra/http/api/answers/responses';

export function ApiUpdateAnswer() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualiza uma resposta existente',
    }),
    ApiResponse({
      status: 200,
      description: 'Resposta editada com sucesso',
      type: UpdateAnswerResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 401, description: 'Você não pode alterar uma resposta de outra pessoa' }),
    ApiResponse({ status: 404, description: 'Nenhuma pergunta encontrado' }),
    ApiResponse({ status: 429, description: 'Too Many Requests' }),
  );
}
