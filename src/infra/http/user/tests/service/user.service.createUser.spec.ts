import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user.service';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories';
import { generateCreatedUser } from '../util/GeneratorUser.util';
import { randomUUID } from 'node:crypto';
import { HttpException } from '@nestjs/common';

describe('UserService - findById', () => {
  let service: UserService;

  const mockRepository = {
    findById: jest.fn(),
    findByUsernameOrEmail: jest.fn(),
    createUser: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaUserRepository, useValue: mockRepository }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not create a user if username or email already exists', async () => {
    const user = generateCreatedUser({
      name: 'Tauan-Ray',
      username: '_tauankk',
      email: 'tauan@example.com',
      password: 'password_hash',
    });

    const responseFindUser = {
      ID_USER: randomUUID(),
      USERNAME: '_tauankk',
      NAME: 'Tauan-Ray',
      EMAIL: 'tauan@example.com',
      ROLE: 'ADMIN',
      DT_CR: new Date(),
    };

    mockRepository.findByUsernameOrEmail.mockResolvedValueOnce(responseFindUser);

    try {
      await service.createUser(user);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Email ou usuário já registrado no sistema');
    }

    expect(mockRepository.findByUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(mockRepository.findByUsernameOrEmail).toHaveBeenCalledWith({
      username: user.username,
      email: user.email,
    });
  });

  it("should be able to create a user if username or email don't exists", async () => {
    const user = generateCreatedUser({
      name: 'Tauan-Ray',
      username: '_tauankk',
      email: 'tauan@example.com',
      password: 'password_hash',
    });

    mockRepository.findByUsernameOrEmail.mockResolvedValueOnce(null);

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

    mockRepository.createUser.mockResolvedValueOnce(createdUser);

    const result = await service.createUser(user);

    expect(mockRepository.findByUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(mockRepository.findByUsernameOrEmail).toHaveBeenCalledWith({
      email: user.email,
      username: user.username,
    });

    expect(mockRepository.createUser).toHaveBeenCalledTimes(1);
    expect(mockRepository.createUser).toHaveBeenCalledWith(user);

    expect(result).toEqual(createdUser);
    expect(result.data.username).toBe(user.username);
    expect(result.message).toBe('Usuário criado com sucesso');
  });
});
