import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/common/guards';
import { QuestionsController } from '../../questions.controller';
import { QuestionsService } from '../../questions.service';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';
import { plainToInstance } from 'class-transformer';
import { GetQuestionByUserDto } from '../../dto';
import { validate } from 'class-validator';
import { randomUUID } from 'crypto';

describe('QuestionsController - getQuestionsByIdUser', () => {
  let controller: QuestionsController;

  const mockService = {
    getQuestionsByIdUser: jest.fn(),
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

  it('should throw error in DTO if ID is missing', async () => {
    const dto = plainToInstance(GetQuestionByUserDto, { id: '' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.getQuestionsByIdUser({ id: '' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
    expect(messages).toContain('O campo de id não pode estar vazio');
  });

  it('should throw error in DTO if ID is not a UUID', async () => {
    const dto = plainToInstance(GetQuestionByUserDto, { id: 'invalid_id' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.getQuestionsByIdUser({ id: 'invalid_id' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
  });

  it('should call service page and limit transformed', async () => {
    const uuid = randomUUID();
    const query = { page: '1', limit: '10', id: uuid };

    const dto = plainToInstance(GetQuestionByUserDto, query);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.getQuestionsByIdUser(dto);

    expect(mockService.getQuestionsByIdUser).toHaveBeenCalledTimes(1);
    expect(mockService.getQuestionsByIdUser).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      id: uuid,
    });
  });

  it('should return all questions of a user if the ID provided is valid', async () => {
    const uuid = randomUUID();
    const userId = randomUUID();
    const questionModel = {
      _data: [
        {
          ID_QT: uuid,
          ID_USER: userId,
          ID_CT: '78fe6b53-6a8e-4b0c-8b80-901059b4af4b',
          TITLE: 'Como criar um projeto next js?',
          DESCRIPTION: 'Quero dicas de como iniciar um projeto next js',
          DT_CR: new Date(),
          DEL_AT: null,
          Category: {
            CATEGORY: 'Desenvolvimento',
          },
          User: {
            USERNAME: 'Tauan',
            ROLE: 'ADMIN',
          },
        },
      ],
      _meta: {
        _results: 1,
        _total_results: 1,
        _page: 1,
        _total_page: 1,
      },
    };
    mockService.getQuestionsByIdUser.mockResolvedValue(questionModel);
    const result = await controller.getQuestionsByIdUser({ id: uuid });

    expect(mockService.getQuestionsByIdUser).toHaveBeenCalledTimes(1);
    expect(mockService.getQuestionsByIdUser).toHaveBeenCalledWith({ id: uuid });
    expect(result).toEqual(questionModel);
  });
});
