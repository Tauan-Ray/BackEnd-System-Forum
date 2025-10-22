import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user.service';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories';
import { generateUpdatedUser } from '../util/GeneratorUser.util';

describe('UserService - findMany', () => {
  let service: UserService;

  const mockRepository = {
    findMany: jest.fn(),
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

  it('should be able to get all Users', async () => {
    const user = generateUpdatedUser({
      name: 'Tauan-Ray',
      username: '_tauankk',
      email: 'tauan@example.com',
    });

    mockRepository.findMany.mockResolvedValueOnce({
      _data: [user],
      _meta: {
        _results: 1,
        _total_results: 1,
        _page: 1,
        _total_page: 1,
      },
    });

    const users = await service.findMany({});

    expect(users._data).toEqual(expect.arrayContaining([expect.objectContaining(user)]));
    expect(mockRepository.findMany).toHaveBeenCalledTimes(1);
  });
});
