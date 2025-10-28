import { ApiProperty } from '@nestjs/swagger';
import { MetaResponseDto, UserResponseDto } from './UserResponse.dto';

export class FindManyUsersResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  _data: UserResponseDto[];

  @ApiProperty({ type: MetaResponseDto })
  _meta: MetaResponseDto;
}
