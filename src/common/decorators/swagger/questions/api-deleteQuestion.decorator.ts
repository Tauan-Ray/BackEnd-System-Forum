import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeleteQuestionResponseDto } from 'src/infra/http/api/questions/response';

export function ApiDeleteQuestion() {
  return applyDecorators(
    ApiOperation({
      summary: 'Deleta uma pergunta (soft delete)',
    }),
    ApiResponse({
      status: 200,
      description: 'Pergunta deletada com sucesso',
      type: DeleteQuestionResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 401, description: 'Você não pode deletar a pergunta de outro usuário' }),
    ApiResponse({ status: 404, description: 'Pergunta não encontrada' }),
    ApiResponse({ status: 429, description: 'Too Many Requests' }),
  );
}
