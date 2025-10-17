import {
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtReponse } from './types';
import { secret } from 'src/config/env';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Necessário informar token do usuário');
    }

    let payload: jwtReponse;
    try {
      payload = await this.jwtService.verifyAsync<jwtReponse>(token, {
        secret: secret.JWT_SECRET_KEY,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token de usuário expirado ou inválido');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
