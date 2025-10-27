import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/common/guards';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';
import { AnswersController } from '../../answers.controller';
import { AnswersService } from '../../answers.service';
import { FindManyAnswersDto } from '../../dto';

describe('AnswersController - getAllAnswers', () => {
  let controller: AnswersController;

  const mockService = {
    getAllAnswers: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswersController],
      providers: [
        {
          provide: AnswersService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(ThrottlerConfigGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AnswersController>(AnswersController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service with empty filters', async () => {
    await controller.getAllAnswers({});

    expect(mockService.getAllAnswers).toHaveBeenCalledTimes(1);
    expect(mockService.getAllAnswers).toHaveBeenCalledWith({});
  });

  it('should ignore invalid page/limit values', async () => {
    const query = { page: 'abc', limit: 'def' };

    const dto = plainToInstance(FindManyAnswersDto, query);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.getAllAnswers(dto);

    expect(mockService.getAllAnswers).toHaveBeenCalledTimes(1);
    expect(mockService.getAllAnswers).toHaveBeenCalledWith({ page: undefined, limit: undefined });
  });

  it('should call service page and limit transformed', async () => {
    const query = { page: '1', limit: '10' };

    const dto = plainToInstance(FindManyAnswersDto, query);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.getAllAnswers(dto);

    expect(mockService.getAllAnswers).toHaveBeenCalledTimes(1);
    expect(mockService.getAllAnswers).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
    });
  });
});
