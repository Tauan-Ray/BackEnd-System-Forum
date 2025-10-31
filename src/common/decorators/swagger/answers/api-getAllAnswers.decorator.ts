import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetManyAnswersResponse } from 'src/infra/http/api/answers/responses';

export function ApiGetAllAnswers() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Retorna todas respostas com paginação',
      description: 'Accessivel apenas para ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: 'Todas as respostas retornadas com sucesso',
      type: GetManyAnswersResponse,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
  );
}
