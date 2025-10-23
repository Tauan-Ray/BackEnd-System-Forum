import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../../categories.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/infra/http/user/user.service';
import { PrismaCategoryRespository } from 'src/infra/database/forum/repositories';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService - getCategoryById', () => {
  let service: CategoriesService;

  const mockRepository = {
    getCategoryById: jest.fn(),
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

  it("should throw NotFoundException if category don't exists", async () => {
    const uuid = randomUUID();
    mockRepository.getCategoryById.mockResolvedValue(null);

    try {
      await service.getCategoryById(uuid);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Categoria não existente');
    }

    expect(mockRepository.getCategoryById).toHaveBeenCalledTimes(1);
    expect(mockRepository.getCategoryById).toHaveBeenCalledWith(uuid);
  });

  it('should return category if exists', async () => {
    const uuid = randomUUID();
    const categoryModel = {
      ID_CT: uuid,
      CATEGORY: 'Desenvolvimento',
      DT_CR: '2025-10-23T17:46:43.189Z',
      DT_UP: '2025-10-23T17:46:43.189Z',
      DEL_AT: null,
    };

    mockRepository.getCategoryById.mockResolvedValue(categoryModel);

    const result = await service.getCategoryById(uuid);

    expect(mockRepository.getCategoryById).toHaveBeenCalledTimes(1);
    expect(mockRepository.getCategoryById).toHaveBeenCalledWith(uuid);
    expect(result).toEqual(categoryModel);
  });
});
