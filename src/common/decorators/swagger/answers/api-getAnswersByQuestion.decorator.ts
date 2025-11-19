import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { getAnswersByQuestionResponse } from 'src/infra/http/api/answers/responses';

export function ApiGetAnswerByQuestion() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retorna as respostas relacionadas a uma pergunta',
    }),
    ApiResponse({
      status: 200,
      description: 'Respostas relacionas a pergunta retornadas com sucesso',
      type: getAnswersByQuestionResponse,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhuma pergunta encontrado' }),
  );
}
