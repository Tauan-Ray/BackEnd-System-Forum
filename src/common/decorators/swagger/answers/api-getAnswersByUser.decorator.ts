import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetManyAnswersResponse } from 'src/infra/http/api/answers/responses';

export function ApiGetAnswerByIdUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retorna as respostas relacionadas a um usuário',
    }),
    ApiResponse({
      status: 200,
      description: 'Respostas relacionas ao usuário retornadas com sucesso',
      type: GetManyAnswersResponse,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhum usuário encontrado' }),
  );
}
