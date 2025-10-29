import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthDto } from 'src/infra/http/auth/dto';
import { AuthResponse } from 'src/infra/http/auth/responses';

export function ApiSignInAuth() {
  return applyDecorators(
    ApiOperation({
      summary: 'Autentica usuário com email e senha',
    }),
    ApiBody({ type: AuthDto }),
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
