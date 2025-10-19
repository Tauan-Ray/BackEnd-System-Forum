import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  response: string;

  @IsUUID()
  @IsNotEmpty()
  ID_QT: string;
}
