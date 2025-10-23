import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../../categories.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/infra/http/user/user.service';
import { PrismaCategoryRespository } from 'src/infra/database/forum/repositories';
import { NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

describe('CategoriesService - deleteCategory', () => {
  let service: CategoriesService;

  const mockRepository = {
    deleteCategory: jest.fn(),
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

    try {
      await service.deleteCategory(uuid);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Categoria não existente');
    }

    expect(getCategoryById).toHaveBeenCalledTimes(1);
    expect(getCategoryById).toHaveBeenCalledWith(uuid);
  });

  it('should delete a category if ID exists', async () => {
    const uuid = randomUUID();
    const categoryModel = {
      ID_CT: uuid,
      CATEGORY: 'Desenvolvimento',
      DT_CR: new Date(),
      DT_UP: new Date(),
      DEL_AT: null,
    };

    const deleteCategoryResponse = {
      message: 'Categoria deletada com sucesso',
    };

    const getCategoryById = jest.spyOn(service, 'getCategoryById');
    getCategoryById.mockResolvedValue(categoryModel);

    const result = await service.deleteCategory(uuid);

    expect(getCategoryById).toHaveBeenCalledTimes(1);
    expect(getCategoryById).toHaveBeenCalledWith(uuid);
    expect(mockRepository.deleteCategory).toHaveBeenCalledTimes(1);
    expect(mockRepository.deleteCategory).toHaveBeenCalledWith(uuid);

    expect(result).toEqual(deleteCategoryResponse);
  });
});
