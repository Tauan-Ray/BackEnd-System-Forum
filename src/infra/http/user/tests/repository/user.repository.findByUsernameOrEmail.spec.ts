import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories/user.repository';
import { PrismaForumService } from 'src/infra/database/forum/prisma.forum.service';
import { randomUUID } from 'crypto';
import { EncryptionService } from 'src/infra/encryption/encryption.service';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;

  const mockPrisma = {
    user: {
      findFirst: jest.fn(),
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

  it('should find user by username', async () => {
    const uuid = randomUUID();
    const userModel = {
      ID_USER: uuid,
      USERNAME: '_tauankk',
      NAME: 'Tauan-Ray',
      EMAIL: 'tauan@example.com',
      ROLE: 'ADMIN',
      DT_CR: new Date(),
    };

    mockPrisma.user.findFirst.mockResolvedValueOnce(userModel);

    const result = await repository.findByUsernameOrEmail({ username: '_tauankk' });

    expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(1);
    expect(result).toEqual(userModel);
  });

  it('should find user by email', async () => {
    const uuid = randomUUID();
    const userModel = {
      ID_USER: uuid,
      USERNAME: '_tauankk',
      NAME: 'Tauan-Ray',
      EMAIL: 'tauan@example.com',
      ROLE: 'ADMIN',
      DT_CR: new Date(),
    };

    mockPrisma.user.findFirst.mockResolvedValueOnce(userModel);

    const result = await repository.findByUsernameOrEmail({ email: 'tauan@example.com' });

    expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(1);
    expect(result).toEqual(userModel);
  });

  it('should return null if user not found', async () => {
    mockPrisma.user.findFirst.mockResolvedValueOnce(null);

    const result = await repository.findByUsernameOrEmail({ email: 'notfound@example.com' });

    expect(result).toBeNull();
  });
});
