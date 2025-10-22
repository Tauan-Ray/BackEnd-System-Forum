import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { JwtGuard } from 'src/common/guards';
import { plainToInstance } from 'class-transformer';
import { FindManyUserDto } from '../../dto';
import { validate } from 'class-validator';

describe('UserController - findMany', () => {
  let controller: UserController;

  const mockService = {
    findMany: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service with empty filters', async () => {
    await controller.findMany({});

    expect(mockService.findMany).toHaveBeenCalledTimes(1);
    expect(mockService.findMany).toHaveBeenCalledWith({});
  });

  it('should ignore invalid page/limit values', async () => {
    const query = { page: 'abc', limit: 'def' };
    const dto = plainToInstance(FindManyUserDto, query);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    await controller.findMany(dto);
    expect(mockService.findMany).toHaveBeenCalledWith({ page: undefined, limit: undefined });
  });

  it('should call service page and limit transformed', async () => {
    const query = { page: '1', limit: '10' };

    const dto = plainToInstance(FindManyUserDto, query);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.findMany(dto);

    expect(mockService.findMany).toHaveBeenCalledTimes(1);
    expect(mockService.findMany).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
    });
  });

  it('should call service with name and email parameters', async () => {
    const query = { EMAIL: 'tauan@example.com', NAME: 'Tauan-Ray' };

    const dto = plainToInstance(FindManyUserDto, query);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.findMany(dto);

    expect(mockService.findMany).toHaveBeenCalledTimes(1);
    expect(mockService.findMany).toHaveBeenCalledWith({
      EMAIL: query.EMAIL,
      NAME: query.NAME,
    });
  });
});
