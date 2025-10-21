import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindUniqueUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;
}
