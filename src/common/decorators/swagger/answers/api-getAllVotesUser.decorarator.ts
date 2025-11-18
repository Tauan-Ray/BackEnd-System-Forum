import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { getAllVotesUserResponse } from 'src/infra/http/api/answers/responses';

export function ApiGetAllVotesUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary:
        'Retorna a quantidade de likes/deslikes que um user ja recebeu em todas as usas respostas',
    }),
    ApiResponse({
      status: 200,
      description: 'Informações retornadas com sucesso',
      type: getAllVotesUserResponse,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
  );
}
