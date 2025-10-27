import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/common/guards';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';
import { AnswersController } from '../../answers.controller';
import { AnswersService } from '../../answers.service';
import { GetAnswersByResourceDto } from '../../dto';
import { randomUUID } from 'crypto';

describe('AnswersController - getAnswerByQuestion', () => {
  let controller: AnswersController;

  const mockService = {
    getAnswersByQuestion: jest.fn(),
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

  it('should throw error in DTO if ID is missing', async () => {
    const dto = plainToInstance(GetAnswersByResourceDto, { id: '' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.getAnswersByQuestion({ id: '' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
    expect(messages).toContain('O campo de id não pode estar vazio');
  });

  it('should throw error in DTO if ID is not a UUID', async () => {
    const dto = plainToInstance(GetAnswersByResourceDto, { id: 'invalid_id' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.getAnswersByQuestion({ id: 'invalid_id' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
  });

  it('should call service page and limit transformed', async () => {
    const uuid = randomUUID();
    const query = { page: '1', limit: '10', id: uuid };

    const dto = plainToInstance(GetAnswersByResourceDto, query);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.getAnswersByQuestion(dto);

    expect(mockService.getAnswersByQuestion).toHaveBeenCalledTimes(1);
    expect(mockService.getAnswersByQuestion).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      id: uuid,
    });
  });

  it('should return all answer of a question if the ID provided is valid', async () => {
    const idQuestion = randomUUID();
    const answerModel = {
      _data: [
        {
          ID_AN: randomUUID(),
          ID_QT: idQuestion,
          RESPONSE: 'Pesquisa',
          DT_CR: new Date(),
          USERNAME: 'Tauan',
          ROLE: 'ADMIN',
          TITLE: 'Como criar um projeto nest js?',
          CATEGORY: 'Desenvolvimento',
          likes: 0,
          dislikes: 0,
        },
      ],
      _meta: {
        _results: 1,
        _total_results: 1,
        _page: 1,
        _total_page: 1,
      },
    };
    mockService.getAnswersByQuestion.mockResolvedValue(answerModel);
    const result = await controller.getAnswersByQuestion({ id: idQuestion });

    expect(mockService.getAnswersByQuestion).toHaveBeenCalledTimes(1);
    expect(mockService.getAnswersByQuestion).toHaveBeenCalledWith({ id: idQuestion });
    expect(result).toEqual(answerModel);
  });
});
