import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories/user.repository';
import { PrismaForumService } from 'src/infra/database/forum/prisma.forum.service';
import { EncryptionService } from 'src/infra/encryption/encryption.service';
import { randomUUID } from 'crypto';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;

  const mockPrisma = {
    user: {
      create: jest.fn(),
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

  it('should create a new user successfully', async () => {
    const user = {
      name: 'Tauan-Ray',
      username: '_tauankk',
      email: 'tauan@example.com',
      password: 'plain_password',
    };

    const hashedPassword = 'hashed_password';
    const createdUser = {
      ID_USER: randomUUID(),
      NAME: 'Tauan-Ray',
      EMAIL: 'tauan@example.com',
      USERNAME: '_tauankk',
      ROLE: 'USER',
    };

    mockEncryption.hash.mockResolvedValueOnce(hashedPassword);
    mockPrisma.user.create.mockResolvedValueOnce(createdUser);

    const result = await repository.createUser(user);

    expect(mockEncryption.hash).toHaveBeenCalledWith('plain_password');
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        NAME: user.name,
        EMAIL: user.email,
        USERNAME: user.username,
        PASSWORD: hashedPassword,
      },
    });

    expect(result.message).toBe('Usuário criado com sucesso');
    expect(result.data.username).toBe(user.username);
  });
});
