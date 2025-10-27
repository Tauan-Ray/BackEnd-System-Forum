import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../../categories.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/infra/http/user/user.service';
import { PrismaCategoryRespository } from 'src/infra/database/forum/repositories';
import { randomUUID } from 'crypto';

describe('CategoriesService - getAllCategories', () => {
  let service: CategoriesService;

  const mockRepository = {
    getAllCategories: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaCategoryRespository,
          useValue: mockRepository,
        },
        { provide: JwtService, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all categories', async () => {
    const uuid = randomUUID();
    const categories = [{ id: uuid, name: 'Desenvolvimento' }];

    mockRepository.getAllCategories.mockResolvedValue(categories);
    const result = await service.getAllCategories();

    expect(mockRepository.getAllCategories).toHaveBeenCalledTimes(1);
    expect(result).toEqual(categories);
  });
});
