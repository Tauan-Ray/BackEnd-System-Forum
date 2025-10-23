import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../../categories.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/infra/http/user/user.service';
import { PrismaCategoryRespository } from 'src/infra/database/forum/repositories';
import { randomUUID } from 'crypto';
import { ConflictException } from '@nestjs/common';

describe('CategoriesService - createCategory', () => {
  let service: CategoriesService;

  const mockRepository = {
    createCategory: jest.fn(),
    getCategoryByName: jest.fn(),
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

  it('should throw ConflictException if exists a category with same name', async () => {
    const uuid = randomUUID();
    const categoryModel = {
      ID_CT: uuid,
      CATEGORY: 'Desenvolvimento',
      DT_CR: '2025-10-23T17:46:43.189Z',
      DT_UP: '2025-10-23T17:46:43.189Z',
      DEL_AT: null,
    };

    const createCategoryModel = {
      name: 'Desenvolvimento',
    };
    mockRepository.getCategoryByName.mockResolvedValue(categoryModel);

    try {
      await service.createCategory(createCategoryModel);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toBe('Categoria com o mesmo nome já existente');
    }

    expect(mockRepository.getCategoryByName).toHaveBeenCalledTimes(1);
    expect(mockRepository.getCategoryByName).toHaveBeenCalledWith(createCategoryModel.name);
    expect(mockRepository.createCategory).toHaveBeenCalledTimes(0);
  });

  it('should create a category with correct data', async () => {
    const uuid = randomUUID();
    const categoryModel = {
      ID_CT: uuid,
      CATEGORY: 'Desenvolvimento',
      DT_CR: '2025-10-23T17:46:43.189Z',
      DT_UP: '2025-10-23T17:46:43.189Z',
      DEL_AT: null,
    };
    const createCategoryResponse = {
      message: 'Categoria criada com sucesso',
      data: categoryModel,
    };
    mockRepository.getCategoryByName.mockResolvedValue(null);
    mockRepository.createCategory.mockResolvedValue(createCategoryResponse);

    const result = await service.createCategory({ name: categoryModel.CATEGORY });

    expect(mockRepository.getCategoryByName).toHaveBeenCalledTimes(1);
    expect(mockRepository.getCategoryByName).toHaveBeenCalledWith(categoryModel.CATEGORY);
    expect(mockRepository.createCategory).toHaveBeenCalledTimes(1);
    expect(mockRepository.createCategory).toHaveBeenCalledWith({ name: categoryModel.CATEGORY });

    expect(result).toEqual(createCategoryResponse);
  });
});
