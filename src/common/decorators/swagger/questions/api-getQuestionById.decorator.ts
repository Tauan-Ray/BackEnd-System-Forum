import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuestionResponseWithDELDto } from 'src/infra/http/api/questions/response';

export function ApiGetQuestionById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retorna uma pergunta pelo seu ID',
    }),
    ApiResponse({
      status: 200,
      description: 'Pergunta retornada com sucesso',
      type: QuestionResponseWithDELDto,
    }),
    ApiResponse({ status: 400, description: 'Dados fornecidos inválidos' }),
    ApiResponse({ status: 404, description: 'Nenhuma pergunta encontrada' }),
  );
}
