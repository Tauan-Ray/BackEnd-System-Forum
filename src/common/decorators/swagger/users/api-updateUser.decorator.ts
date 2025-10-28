import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/infra/http/user/dto';
import { UpdateUserResponseDto } from 'src/infra/http/user/responses';

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualiza um usuário existente',
    }),
    ApiBody({ type: UpdateUserDto }),
    ApiParam({
      name: 'id',
      type: String,
      example: '21408dd4-060e-4ec8-8748-c163a756a493',
      description: 'UUID do usuário a ser atualizado',
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
