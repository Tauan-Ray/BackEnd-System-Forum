import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindManyUsersResponseDto } from 'src/infra/http/user/responses';

export function ApiFindManyUsers() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retorna todos os usuários cadastrados',
      description: 'Acessivel apenas para users ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: 'Todos usuários retornados com sucesso',
      type: FindManyUsersResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 403, description: 'Recurso proibido' }),
  );
}
