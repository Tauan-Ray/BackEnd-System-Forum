import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { DeleteUserDto } from 'src/infra/http/user/dto';
import { DeleteUserResponseDto } from 'src/infra/http/user/responses';

export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Deleta um usuário (soft delete)',
    }),
    ApiBody({ type: DeleteUserDto }),
    ApiParam({
      name: 'id',
      type: String,
      example: '21408dd4-060e-4ec8-8748-c163a756a493',
      description: 'UUID do usuário a ser deletado',
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
