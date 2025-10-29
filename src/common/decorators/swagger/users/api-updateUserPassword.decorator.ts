import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserPasswordResponseDto } from 'src/infra/http/user/responses';

export function ApiUpdateUserPassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualiza a senha de um usuário',
    }),
    ApiResponse({
      status: 200,
      description: 'Senha atualizada com sucesso',
      type: UpdateUserPasswordResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 401, description: 'Você não pode alterar a senha de um outro usuário' }),
    ApiResponse({ status: 403, description: 'Senha atual incorreta' }),
    ApiResponse({ status: 404, description: 'Nenhum usuário encontrado' }),
  );
}
