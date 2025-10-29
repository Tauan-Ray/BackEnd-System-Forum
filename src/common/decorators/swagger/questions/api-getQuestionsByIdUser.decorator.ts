import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetQuestionsByIdUserDto } from 'src/infra/http/api/questions/response';

export function ApiGetQuestionsByIdUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retorna as perguntas relacionadas a um usuário',
    }),
    ApiResponse({
      status: 200,
      description: 'Perguntas relacionas ao usuário retornadas com sucesso',
      type: GetQuestionsByIdUserDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhum usuário encontrado' }),
  );
}
