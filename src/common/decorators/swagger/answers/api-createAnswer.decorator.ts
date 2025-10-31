import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAnswerResponseDto } from 'src/infra/http/api/answers/responses';

export function ApiCreateAnswer() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cria uma nova resposta',
    }),
    ApiResponse({
      status: 201,
      description: 'Resposta criada com sucesso',
      type: CreateAnswerResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhuma pergunta encontrado' }),
    ApiResponse({ status: 429, description: 'Too Many Requests' }),
  );
}
