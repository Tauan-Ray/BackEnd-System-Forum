import { ApiProperty } from '@nestjs/swagger';
import { dataUser } from '.';

export class UpdateUserResponseDto {
  @ApiProperty({ example: 'Usuário atualizado com sucesso' })
  message: string;

  @ApiProperty({ type: [dataUser] })
  data: dataUser[];
}
