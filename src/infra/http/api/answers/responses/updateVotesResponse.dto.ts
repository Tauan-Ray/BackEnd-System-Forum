import { ApiProperty } from '@nestjs/swagger';

enum VotesResponse {
  at = 'Voto atualizado',
  cr = 'Voto criado',
  del = 'Voto removido',
}

export class UpdateVotesResponseDto {
  @ApiProperty({ enum: VotesResponse })
  message: VotesResponse;
}
