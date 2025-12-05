import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetAllQuestionsResponseDto } from 'src/infra/http/api/questions/response';

export function ApiGetAllQuestions(type: 'admin' | 'user') {
  const isAdminRoute = type === 'admin';
  return applyDecorators(
    ApiOperation({
      summary: 'Retorna todas perguntas com paginação',
      description: isAdminRoute ? 'Acessivel apenas para users ADMIN' : '',
    }),
    ApiResponse({
      status: 200,
      description: 'Todas as perguntas retornadas com sucesso',
      type: GetAllQuestionsResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
  );
}
