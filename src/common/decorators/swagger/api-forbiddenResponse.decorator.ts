import { ApiResponse } from '@nestjs/swagger';

export const ApiForbiddenResponse = () =>
  ApiResponse({ status: 403, description: 'Recurso proibido' });
