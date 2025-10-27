import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetIdParamDto {
  @IsUUID(undefined, { message: 'O id deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O campo de id não pode estar vazio' })
  id: string;
}
