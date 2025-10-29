import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { secret } from 'src/config/env';
import { EncryptionService } from 'src/infra/encryption/encryption.service';
import { CreateUserDto } from '../user/dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly encryption: EncryptionService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async signIn(email: string, password: string) {
    const user = await this.userService.findByUsernameOrEmail({ email }, true);

    if (!user) throw new UnauthorizedException('Email e/ou senha incorretos');

    const passwordMatches = await this.encryption.compare(password, user.PASSWORD);
    if (!passwordMatches) throw new UnauthorizedException('Email e/ou senha incorretos');

    const tokens = await this.getTokens({
      sub: user.ID_USER,
      username: user.USERNAME,
      role: user.ROLE,
      email: user.EMAIL,
    });

    return tokens;
  }

  async signUp(userInfos: CreateUserDto) {
    const user = await this.userService.createUser(userInfos);

    const payload = {
      email: user.data.email,
      sub: user.data.id,
      username: user.data.username,
      role: user.data.role,
    };
    const tokens = await this.getTokens(payload);

    return tokens;
  }

  async getNewAccessToken(rt: string) {
    const rtCompare = this.jwtService.verifyAsync(rt, {
      secret: secret.JWT_SECRET_KEY,
    });

    if (!rtCompare) throw new UnauthorizedException('Acesso negado');

    const decodedRefreshToken = this.jwtService.decode(rt);
    const user = await this.userService.findById(decodedRefreshToken.sub);

    const token = await this.getTokens({
      sub: decodedRefreshToken.sub,
      username: decodedRefreshToken.username,
      role: user.ROLE,
      email: user.EMAIL,
    });

    return {
      access_token: token.access_token,
      access_token_expiresIn: token.access_token_expiresIn,
    };
  }

  async getTokens(payload: { sub: string; username: string; email?: string; role?: string }) {
    const access_token_expires = 60 * 10,
      refresh_token_expires = 60 * 60 * 24 * 7;

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { payload, type: 'access' },
        {
          privateKey: secret.JWT_SECRET_KEY,
          expiresIn: access_token_expires,
        },
      ),
      this.jwtService.signAsync(
        { sub: payload.sub, username: payload.username, type: 'refresh' },
        {
          privateKey: secret.JWT_SECRET_KEY,
          expiresIn: refresh_token_expires,
        },
      ),
    ]);

    return {
      access_token,
      access_token_expiresIn: this.calculateExpireToken(access_token_expires),
      refresh_token,
      refresh_token_expiresIn: this.calculateExpireToken(refresh_token_expires),
    };
  }

  calculateExpireToken(token_expires: number): Date {
    return new Date(new Date().getTime() + token_expires * 1000);
  }
}
