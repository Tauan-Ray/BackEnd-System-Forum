import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum TypeVotes {
  like = 'LIKE',
  deslike = 'DESLIKE',
}

export class UpdateVoteDto {
  @ApiProperty({ enum: TypeVotes, description: 'Tipo para indicar se vote é like ou deslike' })
  @IsEnum(TypeVotes)
  @IsNotEmpty()
  type: TypeVotes;
}
