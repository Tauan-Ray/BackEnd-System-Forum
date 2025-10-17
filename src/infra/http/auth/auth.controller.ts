import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { CreateUserDto } from '../user/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async signIn(@Body() signInDto: AuthDto) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async signUp(@Body() signUpDto: CreateUserDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() rt: { refresh_token: string }) {
    return await this.authService.refreshToken(rt.refresh_token);
  }
}
