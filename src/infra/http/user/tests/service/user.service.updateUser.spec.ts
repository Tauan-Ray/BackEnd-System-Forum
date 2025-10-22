import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user.service';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories';
import { randomUUID } from 'node:crypto';
import { generateUpdatedPayload, generateUpdatedUser } from '../util/GeneratorUser.util';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('UserService - updateUser', () => {
  let service: UserService;

  const mockRepository = {
    findByUsernameOrEmail: jest.fn(),
    findById: jest.fn(),
    updateUser: jest.fn(),
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

    const dataUpdateUser = generateUpdatedUser({
      username: 'TauanDev',
      name: 'Tauan-Ray',
      email: 'tauan@example.com',
    });

    mockRepository.findById.mockResolvedValueOnce(null);

    try {
      await service.updateUser(loggedUser, uuid, dataUpdateUser);
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

    const dataUpdateUser = generateUpdatedUser({
      username: 'TauanDev',
      name: 'Tauan-Ray',
      email: 'tauan@example.com',
    });

    mockRepository.findById.mockResolvedValueOnce(userModel);

    try {
      await service.updateUser(loggedUser, userModel.ID_USER, dataUpdateUser);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Você não pode alterar o usuário de outra pessoa');
    }

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(otherId);
  });

  it('should update user with correct data', async () => {
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

    const dataUpdateUser = generateUpdatedUser({
      username: 'Maluzitos',
      name: 'Luísa',
      email: 'luisaa@example.com',
    });

    const updatedUser = {
      message: 'Usuário atualizado com sucesso',
      data: {
        ...dataUpdateUser,
        id: uuid,
        role: 'USER',
      },
    };

    mockRepository.findById.mockResolvedValueOnce(userModel);
    mockRepository.updateUser.mockResolvedValueOnce(updatedUser);

    const result = await service.updateUser(loggedUser, uuid, dataUpdateUser);

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(uuid);

    expect(mockRepository.updateUser).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateUser).toHaveBeenCalledWith(uuid, dataUpdateUser);

    expect(result).toEqual(updatedUser);
    expect(result.data.username).toBe(dataUpdateUser.username);
    expect(result.message).toBe('Usuário atualizado com sucesso');
  });

  it('should update other user if is admin', async () => {
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

    const dataUpdateUser = generateUpdatedUser({
      username: 'TauanDev',
      name: 'Tauan-Ray',
      email: 'tauan@example.com',
    });

    const updatedUser = {
      message: 'Usuário atualizado com sucesso',
      data: {
        ...dataUpdateUser,
        id: otherId,
        role: 'USER',
      },
    };

    mockRepository.findById.mockResolvedValueOnce(userModel);

    mockRepository.updateUser.mockResolvedValueOnce(updatedUser);

    const result = await service.updateUser(loggedUser, userModel.ID_USER, dataUpdateUser);

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(otherId);

    expect(mockRepository.updateUser).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateUser).toHaveBeenCalledWith(otherId, dataUpdateUser);

    expect(result).toEqual(updatedUser);
    expect(result.data.username).toBe(dataUpdateUser.username);
    expect(result.message).toBe('Usuário atualizado com sucesso');
  });
});
