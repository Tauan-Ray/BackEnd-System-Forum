import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdatePasswordDto } from 'src/infra/http/user/dto';
import { UpdateUserPasswordResponseDto } from 'src/infra/http/user/responses';

export function ApiUpdateUserPassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualiza a senha de um usuário',
    }),
    ApiBody({ type: UpdatePasswordDto }),
    ApiParam({
      name: 'id',
      type: String,
      example: '21408dd4-060e-4ec8-8748-c163a756a493',
      description: 'UUID do usuário a ser atualizado',
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
