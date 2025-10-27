import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/common/guards';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { QuestionsController } from '../../questions.controller';
import { QuestionsService } from '../../questions.service';
import { FindManyQuestionsDto } from '../../dto';
import { randomUUID } from 'crypto';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';

describe('QuestionsController - getAllQuestions', () => {
  let controller: QuestionsController;

  const mockService = {
    getAllQuestions: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        {
          provide: QuestionsService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(ThrottlerConfigGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<QuestionsController>(QuestionsController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service with empty filters', async () => {
    await controller.getAllQuestions({});

    expect(mockService.getAllQuestions).toHaveBeenCalledTimes(1);
    expect(mockService.getAllQuestions).toHaveBeenCalledWith({});
  });

  it('should ignore invalid page/limit values', async () => {
    const query = { page: 'abc', limit: 'def' };

    const dto = plainToInstance(FindManyQuestionsDto, query);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.getAllQuestions(dto);

    expect(mockService.getAllQuestions).toHaveBeenCalledTimes(1);
    expect(mockService.getAllQuestions).toHaveBeenCalledWith({ page: undefined, limit: undefined });
  });

  it('should call service page and limit transformed', async () => {
    const query = { page: '1', limit: '10' };

    const dto = plainToInstance(FindManyQuestionsDto, query);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.getAllQuestions(dto);

    expect(mockService.getAllQuestions).toHaveBeenCalledTimes(1);
    expect(mockService.getAllQuestions).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
    });
  });

  it('should call service with ID_QT and TITLE parameters', async () => {
    const query = { ID_QT: randomUUID(), TITLE: 'Como criar projeto NestJS' };

    const dto = plainToInstance(FindManyQuestionsDto, query);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.getAllQuestions(dto);

    expect(mockService.getAllQuestions).toHaveBeenCalledTimes(1);
    expect(mockService.getAllQuestions).toHaveBeenCalledWith({
      ID_QT: query.ID_QT,
      TITLE: query.TITLE,
    });
  });
});
