import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserResponseDto } from 'src/infra/http/user/responses';

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualiza um usuário existente',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário atualizado com sucesso',
      type: UpdateUserResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 401, description: 'Você não pode alterar um outro usuário' }),
    ApiResponse({ status: 403, description: 'Senha atual incorreta' }),
    ApiResponse({ status: 404, description: 'Nenhum usuário encontrado' }),
    ApiResponse({ status: 409, description: 'Email ou username já cadastrados no sistema' }),
  );
}
