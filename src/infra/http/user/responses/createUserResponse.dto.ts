import { ApiProperty } from '@nestjs/swagger';
import { dataUser } from '.';

export class CreateUserResponseDto {
  @ApiProperty({ example: 'Usuário criado com sucesso' })
  message: string;

  @ApiProperty({ type: [dataUser] })
  data: dataUser[];
}
