import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/infra/http/user/dto';
import { CreateUserResponseDto } from 'src/infra/http/user/responses';

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cria um novo usuário',
      description: 'Acessivel apenas para users ADMIN',
    }),
    ApiBody({ type: CreateUserDto }),
    ApiResponse({
      status: 201,
      description: 'Usuário criado com sucesso',
      type: CreateUserResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 403, description: 'Recurso proibido' }),
    ApiResponse({ status: 404, description: 'Nenhum usuário encontrado' }),
    ApiResponse({ status: 409, description: 'Email ou username já cadastrados no sistema' }),
  );
}
