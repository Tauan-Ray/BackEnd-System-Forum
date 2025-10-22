import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user.service';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

describe('UserService - findByUsernameOrEmail', () => {
  let service: UserService;

  const mockRepository = {
    findByUsernameOrEmail: jest.fn(),
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

  it('should throw BadRequestException if username and email is missing', async () => {
    await expect(service.findByUsernameOrEmail({})).rejects.toThrow(BadRequestException);
    await expect(service.findByUsernameOrEmail({})).rejects.toThrow(
      'Necessário enviar pelo menos um parâmetro (username/email)',
    );
  });

  it('should be able to get a user by your username', async () => {
    const uuid = randomUUID();
    const userModel = {
      ID_USER: uuid,
      USERNAME: '_tauankk',
      NAME: 'Tauan-Ray',
      EMAIL: 'tauan@example.com',
      ROLE: 'ADMIN',
      DT_CR: new Date(),
    };
    mockRepository.findByUsernameOrEmail.mockResolvedValueOnce(userModel);

    const user = await service.findByUsernameOrEmail({
      username: userModel.USERNAME,
    });
    expect(user).toMatchObject(userModel);
    expect(user?.USERNAME).toBe('_tauankk');

    expect(mockRepository.findByUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(mockRepository.findByUsernameOrEmail).toHaveBeenCalledWith(
      {
        username: userModel.USERNAME,
      },
      false,
    );
  });

  it('should be able to get a user by your email', async () => {
    const uuid = randomUUID();
    const userModel = {
      ID_USER: uuid,
      USERNAME: '_tauankk',
      NAME: 'Tauan-Ray',
      EMAIL: 'tauan@example.com',
      ROLE: 'ADMIN',
      DT_CR: new Date(),
    };
    mockRepository.findByUsernameOrEmail.mockResolvedValueOnce(userModel);

    const user = await service.findByUsernameOrEmail({
      email: userModel.EMAIL,
    });
    expect(user).toMatchObject(userModel);
    expect(user?.EMAIL).toBe('tauan@example.com');

    expect(mockRepository.findByUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(mockRepository.findByUsernameOrEmail).toHaveBeenCalledWith(
      {
        email: userModel.EMAIL,
      },
      false,
    );
  });

  it("should return null if don't find the user", async () => {
    const uuid = randomUUID();
    const userModel = {
      ID_USER: uuid,
      USERNAME: '_tauankk',
      NAME: 'Tauan-Ray',
      EMAIL: 'tauan@example.com',
      ROLE: 'ADMIN',
      DT_CR: new Date(),
    };
    mockRepository.findByUsernameOrEmail.mockResolvedValueOnce(null);

    const user = await service.findByUsernameOrEmail({
      email: userModel.EMAIL,
    });
    expect(user).toBeNull();

    expect(mockRepository.findByUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(mockRepository.findByUsernameOrEmail).toHaveBeenCalledWith(
      {
        email: userModel.EMAIL,
      },
      false,
    );
  });

  it("should be able to return password if parameter 'return password' is true", async () => {
    const uuid = randomUUID();
    const userModel = {
      ID_USER: uuid,
      USERNAME: '_tauankk',
      NAME: 'Tauan-Ray',
      EMAIL: 'tauan@example.com',
      ROLE: 'ADMIN',
      PASSWORD: 'password_hash',
      DT_CR: new Date(),
    };
    mockRepository.findByUsernameOrEmail.mockResolvedValueOnce(userModel);

    const user = await service.findByUsernameOrEmail(
      {
        email: userModel.EMAIL,
      },
      true,
    );
    expect(user).toMatchObject(userModel);
    expect(user?.EMAIL).toBe('tauan@example.com');
    expect(user?.PASSWORD).toBe('password_hash');

    expect(mockRepository.findByUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(mockRepository.findByUsernameOrEmail).toHaveBeenCalledWith(
      {
        email: userModel.EMAIL,
      },
      true,
    );
  });
});
