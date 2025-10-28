import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindUniqueUserDto {
  @ApiPropertyOptional({
    example: 'tauan@example.com',
    description: 'Filtra pelo email forncecido',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '_tauankk',
    description: 'Filtra pelo username forncecido',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;
}
