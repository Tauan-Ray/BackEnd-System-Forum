import { IsEnum, IsNotEmpty } from 'class-validator';

export enum TypeVotes {
  like = 'LIKE',
  deslike = 'DESLIKE',
}

export class UpdateVoteDto {
  @IsEnum(TypeVotes)
  @IsNotEmpty()
  type: TypeVotes;
}
