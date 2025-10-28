import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories/user.repository';
import { PrismaForumService } from 'src/infra/database/forum/prisma.forum.service';
import { EncryptionService } from 'src/infra/encryption/encryption.service';
import { ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'crypto';

describe('PrismaUserRepository - updateUser', () => {
  let repository: PrismaUserRepository;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockEncryption = {
    compare: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaUserRepository,
        { provide: PrismaForumService, useValue: mockPrisma },
        { provide: EncryptionService, useValue: mockEncryption },
      ],
    }).compile();

    repository = module.get<PrismaUserRepository>(PrismaUserRepository);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should throw ForbiddenException if current password is invalid', async () => {
    const id = randomUUID();

    const existingUser = {
      ID_USER: id,
      PASSWORD: 'hash_salve',
      NAME: 'Tauan',
      EMAIL: 'tauan@example.com',
      USERNAME: 'tauan_dev',
      ROLE: 'USER',
    };

    const data = {
      actualPassword: 'wrong_password',
      username: 'newUser',
      email: 'new@example.com',
      name: 'New Tauan',
    };

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(existingUser as any);
    mockEncryption.compare.mockResolvedValueOnce(false);

    await expect(repository.updateUser(id, data)).rejects.toThrow(
      new ForbiddenException('Senha atual incorreta!'),
    );

    expect(repository.findById).toHaveBeenCalledWith(id, true);
    expect(mockEncryption.compare).toHaveBeenCalledWith('wrong_password', 'hash_salve');
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it('should update user successfully when password is valid', async () => {
    const id = randomUUID();

    const existingUser = {
      ID_USER: id,
      PASSWORD: 'hash_old',
      NAME: 'Tauan',
      EMAIL: 'tauan@example.com',
      USERNAME: 'tauan_dev',
      ROLE: 'USER',
    };

    const updatedUser = {
      ID_USER: id,
      NAME: 'New Tauan',
      EMAIL: 'new@example.com',
      USERNAME: 'newUser',
      ROLE: 'USER',
    };

    const data = {
      actualPassword: 'correct_password',
      username: 'newUser',
      email: 'new@example.com',
      name: 'New Tauan',
    };

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(existingUser as any);
    mockEncryption.compare.mockResolvedValueOnce(true);
    mockPrisma.user.update.mockResolvedValueOnce(updatedUser);

    const result = await repository.updateUser(id, data);

    expect(mockEncryption.compare).toHaveBeenCalledWith('correct_password', 'hash_old');
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { ID_USER: id },
      data: {
        USERNAME: 'newUser',
        EMAIL: 'new@example.com',
        NAME: 'New Tauan',
      },
    });

    expect(result).toEqual({
      message: 'Usuário atualizado com sucesso',
      data: {
        id,
        name: 'New Tauan',
        email: 'new@example.com',
        username: 'newUser',
        role: 'USER',
      },
    });
  });
});
