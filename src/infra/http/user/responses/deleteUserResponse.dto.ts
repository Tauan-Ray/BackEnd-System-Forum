import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty({ example: 'Usuário deletado com sucesso' })
  message: string;
}
