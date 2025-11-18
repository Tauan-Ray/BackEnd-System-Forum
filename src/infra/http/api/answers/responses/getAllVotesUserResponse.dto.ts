import { ApiProperty } from '@nestjs/swagger';

export class getAllVotesUserResponse {
  @ApiProperty({ example: 16 })
  likes: number;

  @ApiProperty({ example: 6 })
  deslikes: number;
}
