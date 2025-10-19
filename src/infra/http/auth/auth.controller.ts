import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { CreateUserDto } from '../user/dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async signIn(@Body() signInDto: AuthDto) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
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
