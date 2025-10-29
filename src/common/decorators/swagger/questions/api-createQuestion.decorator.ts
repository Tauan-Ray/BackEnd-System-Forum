import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateQuestionResponseDto } from 'src/infra/http/api/questions/response';

export function ApiCreateQuestion() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cria uma nova pergunta',
    }),
    ApiResponse({
      status: 201,
      description: 'Pergunta criada com sucesso',
      type: CreateQuestionResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhuma categoria encontrado' }),
    ApiResponse({ status: 429, description: 'Too Many Requests' }),
  );
}
