import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponse } from 'src/infra/http/auth/responses';

export function ApiGetUserMeAuth() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retorna informações do usuário autenticado',
    }),
    ApiResponse({
      status: 200,
      description: 'Dados do usuário obtidos com sucesso',
      type: AuthResponse,
    }),
    ApiResponse({ status: 401, description: 'Necessário informar token' }),
    ApiResponse({ status: 429, description: 'Too Many Requests' }),
  );
}
