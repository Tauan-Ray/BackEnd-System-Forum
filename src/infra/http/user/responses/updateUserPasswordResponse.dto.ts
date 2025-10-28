import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordResponseDto {
  @ApiProperty({ example: 'Senha atualizada com sucesso' })
  message: string;
}
