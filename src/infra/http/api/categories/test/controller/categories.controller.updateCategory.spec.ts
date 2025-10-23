import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../../categories.controller';
import { CategoriesService } from '../../categories.service';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/infra/http/user/user.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import { getCategoryIdDto } from '../../dto/get-category-id.dto';

describe('CategoriesController - updateCategory', () => {
  let controller: CategoriesController;

  const mockService = {
    updateCategory: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockService,
        },
        { provide: JwtService, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw error in DTO if name is missing', async () => {
    const dto = plainToInstance(UpdateCategoryDto, { name: '' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.updateCategory({ id: randomUUID() }, { name: '' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O nome da categoria não pode estar vazio');
  });

  it('should throw error in DTO if lenght name is less than 3 characters', async () => {
    const dto = plainToInstance(UpdateCategoryDto, { name: 'a' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.updateCategory({ id: randomUUID() }, { name: 's' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain(
      'O nome da categoria deve conter no minímo 3 caracteres e no máximo 45',
    );
  });

  it('should throw error in DTO if ID is missing', async () => {
    const dto = plainToInstance(getCategoryIdDto, { id: '' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.updateCategory({ id: '' }, { name: 'test' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O campo de id não pode estar vazio');
  });

  it('should update a category if the name provided is valid', async () => {
    const uuid = randomUUID();
    const categoryModel = {
      ID_CT: uuid,
      CATEGORY: 'Desenvolvimento',
      DT_CR: '2025-10-23T17:46:43.189Z',
      DT_UP: '2025-10-23T17:46:43.189Z',
      DEL_AT: null,
    };

    const categoryUpdateData = {
      name: 'Tecnologia',
    };

    mockService.updateCategory.mockResolvedValue({
      ...categoryModel,
      CATEGORY: categoryUpdateData.name,
    });
    const result = await controller.updateCategory({ id: uuid }, categoryUpdateData);

    expect(mockService.updateCategory).toHaveBeenCalledTimes(1);
    expect(mockService.updateCategory).toHaveBeenCalledWith(uuid, categoryUpdateData);
    expect(result).toEqual({ ...categoryModel, CATEGORY: categoryUpdateData.name });
  });
});
