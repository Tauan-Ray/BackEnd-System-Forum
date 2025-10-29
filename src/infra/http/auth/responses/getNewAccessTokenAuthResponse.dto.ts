import { ApiProperty } from '@nestjs/swagger';

export class GetNewAccessTokenAuthResponse {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
  })
  access_token: string;

  @ApiProperty({ example: '2025-10-29T17:37:00.719Z' })
  access_token_expiresIn: Date;
}
