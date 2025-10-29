import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class getCategoryIdDto {
  @ApiProperty({
    example: 'e8e10cae-9c4c-452d-b6de-85b9076997df',
    description: 'UUID da categoria',
  })
  @IsUUID(undefined, { message: 'O id deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O campo de id não pode estar vazio' })
  id: string;
}
