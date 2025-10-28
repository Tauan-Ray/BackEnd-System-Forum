import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories/user.repository';
import { PrismaForumService } from 'src/infra/database/forum/prisma.forum.service';
import { EncryptionService } from 'src/infra/encryption/encryption.service';
import { ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'crypto';

describe('PrismaUserRepository - deleteUser', () => {
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

  it('should throw ForbiddenException if password is invalid', async () => {
    const userId = randomUUID();
    const existingUser = {
      ID_USER: userId,
      PASSWORD: 'hash_salve',
    };

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(existingUser as any);
    mockEncryption.compare.mockResolvedValueOnce(false);

    await expect(repository.deleteUser(userId, 'wrong_password')).rejects.toThrow(
      new ForbiddenException('Senha atual incorreta!'),
    );

    expect(repository.findById).toHaveBeenCalledWith(userId, true);
    expect(mockEncryption.compare).toHaveBeenCalledWith('wrong_password', 'hash_salve');
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it('should set DEL_AT when password is correct', async () => {
    const userId = randomUUID();
    const existingUser = {
      ID_USER: userId,
      PASSWORD: 'hash_old',
    };

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(existingUser as any);
    mockEncryption.compare.mockResolvedValueOnce(true);
    mockPrisma.user.update.mockResolvedValueOnce({});

    await repository.deleteUser(userId, 'correct_password');

    expect(mockEncryption.compare).toHaveBeenCalledWith('correct_password', 'hash_old');
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { ID_USER: userId },
      data: { DEL_AT: expect.any(Date) },
    });
  });
});
