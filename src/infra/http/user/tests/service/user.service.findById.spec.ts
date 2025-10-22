import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user.service';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

describe('UserService - findById', () => {
  let service: UserService;

  const mockRepository = {
    findById: jest.fn(),
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

  it('should throw NotFoundException if user not exists', async () => {
    const uuid = randomUUID();
    mockRepository.findById.mockResolvedValueOnce(null);

    try {
      await service.findById(uuid);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Usuário não encontrado');
    }

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(uuid);
  });
  it('should be able to get a user by your ID', async () => {
    const uuid = randomUUID();
    const userModel = {
      ID_USER: uuid,
      USERNAME: '_tauankk',
      NAME: 'Tauan-Ray',
      EMAIL: 'tauan@example.com',
      ROLE: 'ADMIN',
      DT_CR: new Date(),
    };

    mockRepository.findById.mockResolvedValueOnce(userModel);

    const user = await service.findById(uuid);

    expect(user).toMatchObject(userModel);
    expect(user.ID_USER).toEqual(uuid);

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(uuid);
  });
});
