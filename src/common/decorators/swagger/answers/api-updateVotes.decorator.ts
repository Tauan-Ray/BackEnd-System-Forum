import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateVotesResponseDto } from 'src/infra/http/api/answers/responses';

export function ApiUpdateVotes() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualiza o voto de um usuário na resposta',
    }),
    ApiResponse({
      status: 200,
      description: 'Voto alterado',
      type: UpdateVotesResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Resposta não encontrada' }),
    ApiResponse({ status: 429, description: 'Too Many Requests' }),
  );
}
