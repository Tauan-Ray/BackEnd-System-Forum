import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, NewAccessTokenDto } from './dto';
import { CreateUserDto } from '../user/dto';
import { Throttle } from '@nestjs/throttler';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiGetNewAccessToken,
  ApiSignInAuth,
  ApiSignUpAuth,
} from 'src/common/decorators/swagger/auth';
import { JwtGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator';
import type { userPayload } from 'src/common/guards/types';
import { ApiGetUserMeAuth } from 'src/common/decorators/swagger/auth/api-getUserMe.decorator';

@Controller('auth')
@ApiTags('Auth')
@ApiResponse({ status: 500, description: 'Erro interno no servidor' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiSignInAuth()
  async signIn(@Body() signInDto: AuthDto) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('/signup')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiSignUpAuth()
  async signUp(@Body() signUpDto: CreateUserDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/refresh-token')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiGetNewAccessToken()
  async getNewAccessToken(@Body() rt: NewAccessTokenDto) {
    return await this.authService.getNewAccessToken(rt.refresh_token);
  }

  @Get('/me')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(JwtGuard)
  @ApiGetUserMeAuth()
  async getUserMe(@GetCurrentUser('payload') user: userPayload) {
    return await this.authService.getUserMe(user.sub);
  }
}
