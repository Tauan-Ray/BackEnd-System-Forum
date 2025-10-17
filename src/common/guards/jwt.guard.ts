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
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/infra/http/user/user.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    const isRouteAdmin = this.reflector.getAllAndOverride('isRouteAdmin', [
      context.getHandler(),
      context.getClass(),
    ]);

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

    if (isRouteAdmin) {
      const user = await this.userService.findById(request['user'].payload.sub);
      if (user?.ROLE !== 'ADMIN') return false
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
