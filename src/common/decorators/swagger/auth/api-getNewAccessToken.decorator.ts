import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetNewAccessTokenAuthResponse } from 'src/infra/http/auth/responses';

export function ApiGetNewAccessToken() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtem um novo token de acesso para o usuário',
    }),
    ApiResponse({
      status: 201,
      description: 'Novo token de acesso gerado com sucesso!',
      type: GetNewAccessTokenAuthResponse,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 401, description: 'Token inválido' }),
    ApiResponse({ status: 429, description: 'Too Many Requests' }),
  );
}
