import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user.service';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories';
import { randomUUID } from 'node:crypto';
import { generateUpdatedPayload } from '../util/GeneratorUser.util';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('UserService - updateUserPassword', () => {
  let service: UserService;

  const mockRepository = {
    findById: jest.fn(),
    updateUserPassword: jest.fn(),
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

    const dataUpdateUserPassword = {
      actualPassword: 'password_hash',
      newPassword: 'new_password',
    };

    mockRepository.findById.mockResolvedValueOnce(null);

    try {
      await service.updateUserPassword(loggedUser, uuid, dataUpdateUserPassword);
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

    const dataUpdateUserPassword = {
      actualPassword: 'password_hash',
      newPassword: 'new_password',
    };

    mockRepository.findById.mockResolvedValueOnce(userModel);

    try {
      await service.updateUserPassword(loggedUser, userModel.ID_USER, dataUpdateUserPassword);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Você não pode alterar o usuário de outra pessoa');
    }

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(otherId);
  });

  it('should update user password with correct data', async () => {
    const uuid = randomUUID();

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      email: 'luisa@example.com',
      username: 'Malu',
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

    const dataUpdateUserPassword = {
      actualPassword: 'password_hash',
      newPassword: 'new_password',
    };

    const responseUpdatePassword = { message: 'Senha atualizada com sucesso' };

    mockRepository.findById.mockResolvedValueOnce(userModel);
    mockRepository.updateUserPassword.mockResolvedValueOnce(responseUpdatePassword);

    const result = await service.updateUserPassword(loggedUser, uuid, dataUpdateUserPassword);

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(uuid);

    expect(mockRepository.updateUserPassword).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateUserPassword).toHaveBeenCalledWith(uuid, dataUpdateUserPassword);

    expect(result).toEqual(responseUpdatePassword);
    expect(result.message).toBe('Senha atualizada com sucesso');
  });

  it('should update other user if is admin', async () => {
    const uuid = randomUUID();
    const otherId = randomUUID();

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      email: 'tauan@example.com',
      username: '_tauankk',
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

    const dataUpdateUserPassword = {
      actualPassword: 'password_hash',
      newPassword: 'new_password',
    };

    const responseUpdatePassword = { message: 'Senha atualizada com sucesso' };

    mockRepository.findById.mockResolvedValueOnce(userModel);

    mockRepository.updateUserPassword.mockResolvedValueOnce(responseUpdatePassword);

    const result = await service.updateUserPassword(
      loggedUser,
      userModel.ID_USER,
      dataUpdateUserPassword,
    );

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(otherId);

    expect(mockRepository.updateUserPassword).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateUserPassword).toHaveBeenCalledWith(otherId, dataUpdateUserPassword);

    expect(result).toEqual(responseUpdatePassword);
    expect(result.message).toBe('Senha atualizada com sucesso');
  });
});
