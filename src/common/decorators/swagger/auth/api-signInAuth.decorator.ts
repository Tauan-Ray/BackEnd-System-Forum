import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponse } from 'src/infra/http/auth/responses';

export function ApiSignInAuth() {
  return applyDecorators(
    ApiOperation({
      summary: 'Autentica usuário com email e senha',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário autenticado com sucesso',
      type: AuthResponse,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 401, description: 'Email e/ou senha incorretos' }),
    ApiResponse({ status: 429, description: 'Too Many Requests' }),
  );
}
