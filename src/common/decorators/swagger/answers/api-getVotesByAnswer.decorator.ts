import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetVotesByAnswerRespone } from 'src/infra/http/api/answers/responses';

export function ApiGetVotesByAnswer() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retorna a quantidade de likes/deslikes de uma resposta',
    }),
    ApiResponse({
      status: 200,
      description: 'Informações retornadas com sucesso',
      type: GetVotesByAnswerRespone,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhuma resposta encontrada' }),
  );
}
