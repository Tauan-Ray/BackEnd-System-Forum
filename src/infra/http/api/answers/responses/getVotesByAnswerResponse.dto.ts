import { ApiProperty } from '@nestjs/swagger';

export class GetVotesByAnswerRespone {
  @ApiProperty({ example: 'bd2ae669-75a4-435c-ab54-d0ac8842906d' })
  ID_AN: string;

  @ApiProperty({ example: 16 })
  LIKES: number;

  @ApiProperty({ example: 6 })
  DESLIKES: number;
}
