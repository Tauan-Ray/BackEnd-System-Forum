import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetIdParamDto {
  @ApiProperty({
    example: 'c0d3869e-5cf7-427d-a067-8441ee3b3381',
    description: 'ID da resposta a ser buscada',
  })
  @IsUUID(undefined, { message: 'O id deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O campo de id não pode estar vazio' })
  id: string;
}
