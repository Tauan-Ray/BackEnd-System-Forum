import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from 'src/infra/http/user/responses';

export function ApiFindByIdUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retorna um usuário pelo seu ID',
      description: 'Acessivel apenas para users ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário retornado com sucesso',
      type: UserResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 403, description: 'Recurso proibido' }),
    ApiResponse({ status: 404, description: 'Nenhum usuário encontrado' }),
  );
}
