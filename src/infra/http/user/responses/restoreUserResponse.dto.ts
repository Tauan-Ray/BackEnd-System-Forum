import { ApiProperty } from '@nestjs/swagger';

export class RestoreUserResponseDto {
  @ApiProperty({ example: 'Usuário restaurado com sucesso' })
  message: string;
}
