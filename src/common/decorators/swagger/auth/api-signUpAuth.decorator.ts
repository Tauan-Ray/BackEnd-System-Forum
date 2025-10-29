import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponse } from 'src/infra/http/auth/responses';
import { CreateUserDto } from 'src/infra/http/user/dto';

export function ApiSignUpAuth() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cadastra um novo usuário no sistema',
    }),
    ApiBody({ type: CreateUserDto }),
    ApiResponse({
      status: 201,
      description: 'Usuário cadastrado com sucesso',
      type: AuthResponse,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 409, description: 'Email ou usuário já registrado no sistema' }),
    ApiResponse({ status: 429, description: 'Too Many Requests' }),
  );
}
