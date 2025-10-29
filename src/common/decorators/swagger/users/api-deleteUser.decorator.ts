import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeleteUserResponseDto } from 'src/infra/http/user/responses';

export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Deleta um usuário (soft delete)',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário deletado com sucesso',
      type: DeleteUserResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 401, description: 'Você não pode deletar um outro usuário' }),
    ApiResponse({ status: 403, description: 'Senha atual incorreta' }),
    ApiResponse({ status: 404, description: 'Nenhum usuário encontrado' }),
  );
}
