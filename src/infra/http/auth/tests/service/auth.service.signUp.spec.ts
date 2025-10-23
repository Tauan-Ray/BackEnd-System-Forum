import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/infra/http/user/user.service';
import { AuthService } from '../../auth.service';
import { EncryptionService } from 'src/infra/encryption/encryption.service';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

describe('AuthService - signUp', () => {
  let service: AuthService;

  const mockUserService = {
    createUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
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

  it('should register user if data correct', async () => {
    const signUpData = {
      username: '_tauankk',
      name: 'Tauan-Ray',
      email: 'tauanexample',
      password: 'password_hash',
    };

    const createdUser = {
      message: 'Usuário criado com sucesso',
      data: {
        id: randomUUID(),
        name: 'Tauan-Ray',
        username: '_tauankk',
        email: 'tauan@example.com',
        role: 'USER',
      },
    };

    mockUserService.createUser.mockResolvedValueOnce(createdUser);
    const spyGetTokens = jest.spyOn(service, 'getTokens');

    const result = await service.signUp(signUpData);

    expect(spyGetTokens).toHaveBeenCalledTimes(1);
    expect(spyGetTokens).toHaveBeenCalledWith({
      sub: createdUser.data.id,
      username: createdUser.data.username,
      role: createdUser.data.role,
      email: createdUser.data.email,
    });

    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('access_token_expiresIn');
  });
});
