import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateQuestionResponseDto } from 'src/infra/http/api/questions/response';

export function ApiUpdateQuestion() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualiza uma pergunta existente',
    }),
    ApiResponse({
      status: 200,
      description: 'Pergunta editada com sucesso',
      type: UpdateQuestionResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 401, description: 'Você não pode alterar uma pergunta de outra pessoa' }),
    ApiResponse({ status: 404, description: 'Nenhuma categoria encontrado' }),
    ApiResponse({ status: 429, description: 'Too Many Requests' }),
  );
}
