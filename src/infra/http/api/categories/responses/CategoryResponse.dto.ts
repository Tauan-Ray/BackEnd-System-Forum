import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: '78fe6b53-6a8e-4b0c-8b80-901059b4af4b' })
  ID_CT: string;

  @ApiProperty({ example: 'Desenvolvimento' })
  CATEGORY: string;

  @ApiProperty({ example: '2025-10-23T17:46:43.189Z' })
  DT_CR: Date;

  @ApiProperty({ example: '2025-10-23T17:46:43.189Z' })
  DT_UP: Date;

  @ApiProperty({ example: null, nullable: true })
  DEL_AT: string | null;
}
