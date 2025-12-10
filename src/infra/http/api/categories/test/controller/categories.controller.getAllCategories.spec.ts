import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../../categories.controller';
import { CategoriesService } from '../../categories.service';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/infra/http/user/user.service';

describe('CategoriesController - getAllCategories', () => {
  let controller: CategoriesController;

  const mockService = {
    getAllCategories: jest.fn(),
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

  it('should call service to get all categories', async () => {
    const uuid = randomUUID();
    const categories = [{ id: uuid, name: 'Desenvolvimento' }];

    mockService.getAllCategories.mockResolvedValue(categories);

    const result = await controller.getAllCategories({});

    expect(mockService.getAllCategories).toHaveBeenCalledTimes(1);
    expect(result).toEqual(categories);
  });
});
