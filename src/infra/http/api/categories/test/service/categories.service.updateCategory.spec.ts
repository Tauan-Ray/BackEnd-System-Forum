import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../../categories.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/infra/http/user/user.service';
import { PrismaCategoryRespository } from 'src/infra/database/forum/repositories';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

describe('CategoriesService - updateCategory', () => {
  let service: CategoriesService;

  const mockRepository = {
    updateCategory: jest.fn(),
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

  it('should throw NotFoundException if category does not exists', async () => {
    const uuid = randomUUID();
    const getCategoryById = jest.spyOn(service, 'getCategoryById');
    getCategoryById.mockRejectedValueOnce(new NotFoundException('Categoria não existente'));

    const updateCategoryModel = {
      name: 'Desenvolvimento',
    };

    try {
      await service.updateCategory(uuid, updateCategoryModel);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Categoria não existente');
    }

    expect(getCategoryById).toHaveBeenCalledTimes(1);
    expect(getCategoryById).toHaveBeenCalledWith(uuid);
  });

  it('should throw ConflictException if exists a category with same name', async () => {
    const uuid = randomUUID();
    const categoryModel = {
      ID_CT: uuid,
      CATEGORY: 'Desenvolvimento',
      DT_CR: new Date(),
      DT_UP: new Date(),
      DEL_AT: null,
    };

    const updateCategoryModel = {
      name: 'Desenvolvimento',
    };

    const getCategoryById = jest.spyOn(service, 'getCategoryById');
    getCategoryById.mockResolvedValue(categoryModel);

    mockRepository.getCategoryByName.mockResolvedValue(categoryModel);

    try {
      await service.updateCategory(uuid, updateCategoryModel);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toBe('Categoria com o mesmo nome já existente');
    }

    expect(mockRepository.getCategoryByName).toHaveBeenCalledTimes(1);
    expect(mockRepository.getCategoryByName).toHaveBeenCalledWith(updateCategoryModel.name);
    expect(getCategoryById).toHaveBeenCalledTimes(1);
    expect(getCategoryById).toHaveBeenCalledWith(uuid);
    expect(mockRepository.updateCategory).toHaveBeenCalledTimes(0);
  });

  it('should update category if data is correct', async () => {
    const uuid = randomUUID();
    const categoryModel = {
      ID_CT: uuid,
      CATEGORY: 'Desenvolvimento',
      DT_CR: new Date(),
      DT_UP: new Date(),
      DEL_AT: null,
    };

    const updateCategoryModel = {
      name: 'Tecnologia',
    };

    const updateCategoryResponse = {
      message: 'Categoria atualizada com sucesso',
      data: { ...categoryModel, CATEGORY: updateCategoryModel.name },
    };

    const getCategoryById = jest.spyOn(service, 'getCategoryById');
    getCategoryById.mockResolvedValue(categoryModel);

    mockRepository.getCategoryByName.mockResolvedValue(null);
    mockRepository.updateCategory.mockResolvedValue(updateCategoryResponse);

    const result = await service.updateCategory(uuid, updateCategoryModel);

    expect(mockRepository.getCategoryByName).toHaveBeenCalledTimes(1);
    expect(mockRepository.getCategoryByName).toHaveBeenCalledWith(updateCategoryModel.name);
    expect(getCategoryById).toHaveBeenCalledTimes(1);
    expect(getCategoryById).toHaveBeenCalledWith(uuid);
    expect(mockRepository.updateCategory).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateCategory).toHaveBeenCalledWith(uuid, updateCategoryModel);

    expect(result).toEqual(updateCategoryResponse);
  });
});
