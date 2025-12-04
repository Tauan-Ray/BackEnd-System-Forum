import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RestoreUserResponseDto } from 'src/infra/http/user/responses';

export function ApiRestoreUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Restaura um usuário deletado',
      description: 'Acessivel apenas para users ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário restaurado com sucesso',
      type: RestoreUserResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhum usuário encontrado' }),
    ApiResponse({ status: 422, description: 'O usuário não está com o status de deletado' }),
  );
}
