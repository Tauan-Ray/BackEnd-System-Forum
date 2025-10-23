import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/infra/http/user/user.service';
import { AuthService } from '../../auth.service';
import { EncryptionService } from 'src/infra/encryption/encryption.service';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

describe('AuthService - signIn', () => {
  let service: AuthService;

  const mockUserService = {
    findByUsernameOrEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockEncryption = {
    compare: jest.fn(),
  };

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

  it('should throw UnauthorizedException if email not registered', async () => {
    const signInData = {
      email: 'tauan@example.com',
      password: 'password_hash',
    };

    mockUserService.findByUsernameOrEmail.mockResolvedValueOnce(null);

    try {
      await service.signIn(signInData.email, signInData.password);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Email e/ou senha incorretos');
    }

    expect(mockUserService.findByUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(mockUserService.findByUsernameOrEmail).toHaveBeenCalledWith(
      {
        email: signInData.email,
      },
      true,
    );
  });

  it('should throw UnauthorizedException if password for email is incorrect', async () => {
    const signInData = {
      email: 'tauan@example.com',
      password: 'wrong_password',
    };

    const userModel = {
      ID_USER: randomUUID(),
      USERNAME: '_tauankk',
      NAME: 'Tauan-Ray',
      EMAIL: 'tauan@example.com',
      ROLE: 'ADMIN',
      PASSWORD: 'correct_password',
      DT_CR: new Date(),
    };

    mockUserService.findByUsernameOrEmail.mockResolvedValueOnce(userModel);
    mockEncryption.compare.mockResolvedValueOnce(false);

    try {
      await service.signIn(signInData.email, signInData.password);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Email e/ou senha incorretos');
    }

    expect(mockUserService.findByUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(mockUserService.findByUsernameOrEmail).toHaveBeenCalledWith(
      {
        email: signInData.email,
      },
      true,
    );

    expect(mockEncryption.compare).toHaveBeenCalledTimes(1);
    expect(mockEncryption.compare).toHaveBeenCalledWith(signInData.password, userModel.PASSWORD);
  });

  it('should login user if email and password is correct', async () => {
    const signInData = {
      email: 'tauan@example.com',
      password: 'hash_password',
    };

    const userModel = {
      ID_USER: randomUUID(),
      USERNAME: '_tauankk',
      NAME: 'Tauan-Ray',
      EMAIL: 'tauan@example.com',
      ROLE: 'ADMIN',
      PASSWORD: 'hash_password',
      DT_CR: new Date(),
    };

    mockUserService.findByUsernameOrEmail.mockResolvedValueOnce(userModel);
    mockEncryption.compare.mockResolvedValueOnce(true);

    const spyGetTokens = jest.spyOn(service, 'getTokens');

    const result = await service.signIn(signInData.email, signInData.password);

    expect(spyGetTokens).toHaveBeenCalledTimes(1);
    expect(spyGetTokens).toHaveBeenCalledWith({
      sub: userModel.ID_USER,
      username: userModel.USERNAME,
      role: userModel.ROLE,
      email: userModel.EMAIL,
    });

    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('access_token_expiresIn');
  });
});
