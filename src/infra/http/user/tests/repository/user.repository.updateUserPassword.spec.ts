import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories/user.repository';
import { PrismaForumService } from 'src/infra/database/forum/prisma.forum.service';
import { EncryptionService } from 'src/infra/encryption/encryption.service';
import { randomUUID } from 'crypto';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;

  const mockPrisma = {
    user: {
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockEncryption = {
    hash: jest.fn(),
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

  it('should throw UnauthorizedException if password is incorrect', async () => {
    const userId = randomUUID();
    const existingUser = { PASSWORD: 'hash_salve' };

    mockPrisma.user.findUnique.mockResolvedValueOnce(existingUser);
    mockEncryption.compare.mockResolvedValueOnce(false);

    const data = {
      actualPassword: 'wrong_password',
      newPassword: 'new_password',
    };

    await expect(repository.updateUserPassword(userId, data)).rejects.toThrow(
      'Senha atual incorreta!',
    );

    expect(mockEncryption.compare).toHaveBeenCalledTimes(1);
    expect(mockEncryption.compare).toHaveBeenCalledWith('wrong_password', 'hash_salve');
  });

  it('should update password successfully when current password is valid', async () => {
    const userId = randomUUID();
    const existingUser = { PASSWORD: 'hash_old' };

    mockPrisma.user.findUnique.mockResolvedValueOnce(existingUser);
    mockEncryption.compare.mockResolvedValueOnce(true);
    mockEncryption.hash.mockResolvedValueOnce('hash_new');
    mockPrisma.user.update.mockResolvedValueOnce({});

    const data = {
      actualPassword: 'old_password',
      newPassword: 'new_password',
    };

    await repository.updateUserPassword(userId, data);

    expect(mockEncryption.compare).toHaveBeenCalledWith('old_password', 'hash_old');
    expect(mockEncryption.hash).toHaveBeenCalledWith('new_password');
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { ID_USER: userId },
      data: { PASSWORD: 'hash_new' },
    });
  });
});
