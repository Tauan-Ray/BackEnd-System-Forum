import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/infra/http/user/user.service';
import { AuthService } from '../../auth.service';
import { EncryptionService } from 'src/infra/encryption/encryption.service';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { secret } from 'src/config/env';

describe('AuthService - getNewAccessToken', () => {
  let service: AuthService;

  const mockUserService = {
    findById: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn(),
    signAsync: jest.fn(),
    decode: jest.fn(),
  };

  const mockEncryption = {};

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: EncryptionService, useValue: mockEncryption },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw UnauthorizedException if refresh token is invalid', async () => {
    const rt = 'refreshToken';
    mockJwtService.verifyAsync.mockRejectedValue(new UnauthorizedException('Acesso negado'));

    try {
      await service.getNewAccessToken(rt);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Acesso negado');
    }

    expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(1);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(rt, { secret: secret.JWT_SECRET_KEY });
  });

  it('should get new access token if refresh token is valid', async () => {
    const rt = 'refreshToken';
    const userModel = {
      ID_USER: randomUUID(),
      USERNAME: '_tauankk',
      NAME: 'Tauan-Ray',
      EMAIL: 'tauan@example.com',
      ROLE: 'ADMIN',
      DT_CR: new Date(),
    };
    const payloadRefreshToken = { sub: randomUUID(), username: '_tauankk' };

    mockJwtService.verifyAsync.mockReturnValue(true);
    mockJwtService.decode.mockReturnValue(payloadRefreshToken);
    mockUserService.findById.mockResolvedValue(userModel);

    const spyGetTokens = jest.spyOn(service, 'getTokens');

    const result = await service.getNewAccessToken(rt);

    expect(spyGetTokens).toHaveBeenCalledTimes(1);
    expect(spyGetTokens).toHaveBeenCalledWith({
      sub: payloadRefreshToken.sub,
      username: payloadRefreshToken.username,
      email: userModel.EMAIL,
      role: userModel.ROLE,
    });

    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('access_token_expiresIn');
  });
});
