import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetIdParamDto {
  @ApiProperty({
    example: '21408dd4-060e-4ec8-8748-c163a756a493',
    description: 'Obtem o ID do usuário',
  })
  @IsUUID(undefined, { message: 'O id deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O campo de id não pode estar vazio' })
  id: string;
}
