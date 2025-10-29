import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewAccessTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MzEwMzk3MC03NDkzLTRhOTQtYjNlNS05ZmE3MmE5MTY0YTEiLCJ1c2VybmFtZSI6IlRhdWFuIEFkbWluIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NjE3NjQ5NTksImV4cCI6MTc2MjM2OTc1OX0.rMD5Uhg9M3w_p5g2ie-P6C_DNTgU3-kIVUM7pBLh37g',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
