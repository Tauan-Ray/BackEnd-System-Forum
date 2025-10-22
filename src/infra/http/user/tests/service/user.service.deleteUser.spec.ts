import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user.service';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories';
import { randomUUID } from 'node:crypto';
import { generateUpdatedPayload } from '../util/GeneratorUser.util';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('UserService - deleteUser', () => {
  let service: UserService;

  const mockRepository = {
    findById: jest.fn(),
    deleteUser: jest.fn(),
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
    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      email: 'tauan@example.com',
      username: '_tauankk',
      role: 'USER',
    });

    mockRepository.findById.mockResolvedValueOnce(null);

    try {
      await service.deleteUser(loggedUser, uuid);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Usuário não encontrado');
    }

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(uuid);
  });

  it('should throw UnauthorizedException if not is the same user', async () => {
    const uuid = randomUUID();
    const otherId = randomUUID();

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      email: 'tauan@example.com',
      username: '_tauankk',
      role: 'USER',
    });

    const userModel = {
      ID_USER: otherId,
      USERNAME: 'Malu',
      NAME: 'Maria-Luísa',
      EMAIL: 'luisa@example.com',
      ROLE: 'USER',
      DT_CR: new Date(),
    };

    mockRepository.findById.mockResolvedValueOnce(userModel);

    try {
      await service.deleteUser(loggedUser, userModel.ID_USER);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Você não pode deletar o usuário de outra pessoa!');
    }

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(otherId);
  });

  it('should delete user successfully when it is the same user', async () => {
    const uuid = randomUUID();

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: 'Malu',
      email: 'luisa@example.com',
      role: 'USER',
    });

    const userModel = {
      ID_USER: uuid,
      USERNAME: 'Malu',
      NAME: 'Maria-Luísa',
      EMAIL: 'luisa@example.com',
      ROLE: 'USER',
      DT_CR: new Date(),
    };

    const responseDeleteUser = {
      message: 'Usuário deletado com sucesso',
    };

    mockRepository.findById.mockResolvedValueOnce(userModel);
    mockRepository.deleteUser.mockResolvedValueOnce(responseDeleteUser);

    const result = await service.deleteUser(loggedUser, uuid);

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(uuid);

    expect(mockRepository.deleteUser).toHaveBeenCalledTimes(1);
    expect(mockRepository.deleteUser).toHaveBeenCalledWith(uuid);

    expect(result).toEqual(responseDeleteUser);
    expect(result.message).toBe('Usuário deletado com sucesso');
  });

  it('should delete other user if is admin', async () => {
    const uuid = randomUUID();
    const otherId = randomUUID();

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'ADMIN',
    });

    const userModel = {
      ID_USER: otherId,
      USERNAME: 'Malu',
      NAME: 'Maria-Luísa',
      EMAIL: 'luisa@example.com',
      ROLE: 'USER',
      DT_CR: new Date(),
    };

    const updatedUser = {
      message: 'Usuário deletado com sucesso',
    };

    mockRepository.findById.mockResolvedValueOnce(userModel);

    mockRepository.deleteUser.mockResolvedValueOnce(updatedUser);

    const result = await service.deleteUser(loggedUser, userModel.ID_USER);

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(otherId);

    expect(mockRepository.deleteUser).toHaveBeenCalledTimes(1);
    expect(mockRepository.deleteUser).toHaveBeenCalledWith(otherId);

    expect(result).toEqual(updatedUser);
    expect(result.message).toBe('Usuário deletado com sucesso');
  });
});
