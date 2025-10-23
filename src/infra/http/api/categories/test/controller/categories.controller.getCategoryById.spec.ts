import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../../categories.controller';
import { CategoriesService } from '../../categories.service';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/infra/http/user/user.service';
import { plainToInstance } from 'class-transformer';
import { getCategoryIdDto } from '../../dto/get-category-id.dto';
import { validate } from 'class-validator';

describe('CategoriesController - getCategoryById', () => {
  let controller: CategoriesController;

  const mockService = {
    getCategoryById: jest.fn(),
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

  it('should throw error in DTO if ID is missing', async () => {
    const dto = plainToInstance(getCategoryIdDto, { id: '' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.getCategoryById({ id: '' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
    expect(messages).toContain('O campo de id não pode estar vazio');
  });

  it('should throw error in DTO if ID is not a UUID', async () => {
    const dto = plainToInstance(getCategoryIdDto, { id: 'invalid_id' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.getCategoryById({ id: 'invalid_id' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
  });

  it('should return a category if the ID provided is valid', async () => {
    const uuid = randomUUID();
    const categoryModel = {
      ID_CT: uuid,
      CATEGORY: 'Desenvolvimento',
      DT_CR: '2025-10-23T17:46:43.189Z',
      DT_UP: '2025-10-23T17:46:43.189Z',
      DEL_AT: null,
    };
    mockService.getCategoryById.mockResolvedValue(categoryModel);
    const result = await controller.getCategoryById({ id: uuid });

    expect(mockService.getCategoryById).toHaveBeenCalledTimes(1);
    expect(result).toEqual(categoryModel);
  });
});
