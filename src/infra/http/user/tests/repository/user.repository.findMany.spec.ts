import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories/user.repository';
import { PrismaForumService } from 'src/infra/database/forum/prisma.forum.service';
import { randomUUID } from 'crypto';
import { EncryptionService } from 'src/infra/encryption/encryption.service';

describe('PrismaUserRepository - findMany', () => {
  let repository: PrismaUserRepository;

  const mockPrisma = {
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
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

  it('should return paginated users with metadata', async () => {
    const mockUsers = [
      {
        ID_USER: randomUUID(),
        EMAIL: 'tauan@example.com',
        NAME: 'Tauan-Ray',
        USERNAME: '_tauankk',
        ROLE: 'ADMIN',
        DEL_AT: null,
      },
    ];

    mockPrisma.user.count.mockResolvedValueOnce(1);
    mockPrisma.user.findMany.mockResolvedValueOnce(mockUsers);

    const result = await repository.findMany({ page: 0, limit: 10 });

    expect(mockPrisma.user.count).toHaveBeenCalledTimes(1);
    expect(mockPrisma.user.findMany).toHaveBeenCalledTimes(1);

    expect(result._data).toEqual(mockUsers);
    expect(result._meta).toEqual({
      _results: 1,
      _total_results: 1,
      _page: 1,
      _total_page: 1,
    });
  });
});
