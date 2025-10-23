import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth.service';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from 'src/infra/encryption/encryption.service';
import { UserService } from 'src/infra/http/user/user.service';

describe('AuthService - getTokens', () => {
  let service: AuthService;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: EncryptionService, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => jest.clearAllMocks());

  it('should return access and refresh tokens with expiration data', async () => {
    mockJwtService.signAsync
      .mockResolvedValueOnce('access_token_mock')
      .mockResolvedValueOnce('refresh_token_mock');

    const payload = { sub: 'uuid', username: '_tauankk', email: 'tauan@example.com', role: 'USER' };

    const result = await service.getTokens(payload);

    expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    expect(result).toEqual(
      expect.objectContaining({
        access_token: 'access_token_mock',
        access_token_expiresIn: expect.any(Date),
        refresh_token: 'refresh_token_mock',
        refresh_token_expiresIn: expect.any(Date),
      }),
    );
  });
});
