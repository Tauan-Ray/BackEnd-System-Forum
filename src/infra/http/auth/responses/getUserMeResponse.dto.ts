import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class GetUserMeResponseDto {
  @ApiProperty({
    example: 'b07d6929-5402-4e2f-b77f-f22283275af2',
  })
  ID_USER: string;

  @ApiProperty({ example: 'tauan@example.com' })
  EMAIL: string;

  @ApiProperty({
    example: '_tauankk',
  })
  USERNAME: string;

  @ApiProperty({ example: 'USER' })
  ROLE: UserRole;

  @ApiProperty({ example: 'null' })
  DEL_AT: Date | null;

  @ApiProperty({ example: '2025-10-27T1:58:49.624Z' })
  DT_CR: Date;

  @ApiProperty({ example: '2025-10-27T1:58:49.624Z' })
  DT_UP: Date;

  @ApiProperty({ example: { Question: 7, Answers: 3 } })
  _count: {
    Question: number;
    Answers: number;
  };
}
