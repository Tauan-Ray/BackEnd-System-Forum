import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnswerResponse } from 'src/infra/http/api/answers/responses/AnswerResponse.dto';

export function ApiGetAnswerById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retorna uma resposta pelo seu ID',
    }),
    ApiResponse({
      status: 200,
      description: 'Resposta retornada com sucesso',
      type: AnswerResponse,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhuma pergunta encontrada' }),
  );
}
