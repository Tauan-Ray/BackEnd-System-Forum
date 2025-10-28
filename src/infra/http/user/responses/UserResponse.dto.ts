import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '28449edc-aa8f-4557-99c0-0c7b424ae827' })
  ID_USER: string;

  @ApiProperty({ example: 'luisa@example.com' })
  EMAIL: string;

  @ApiProperty({ example: 'luisa' })
  NAME: string;

  @ApiProperty({ example: 'maluzitos' })
  USERNAME: string;

  @ApiProperty({ example: 'USER' })
  ROLE: string;

  @ApiProperty({ example: null, nullable: true })
  DEL_AT: string | null;
}

export class dataUser {
  @ApiProperty({ example: '28449edc-aa8f-4557-99c0-0c7b424ae827' })
  id: string;

  @ApiProperty({ example: 'Tauan-Ray' })
  name: string;

  @ApiProperty({ example: 'tauan@example.com' })
  email: string;

  @ApiProperty({ example: '_tauankk' })
  username: string;

  @ApiProperty({ example: 'USER' })
  role: string;
}

export class MetaResponseDto {
  @ApiProperty({ example: 3 })
  _results: number;

  @ApiProperty({ example: 3 })
  _total_results: number;

  @ApiProperty({ example: 1 })
  _page: number;

  @ApiProperty({ example: 1 })
  _total_page: number;
}
