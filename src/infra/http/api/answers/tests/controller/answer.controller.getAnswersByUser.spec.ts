import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/common/guards';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';
import { AnswersController } from '../../answers.controller';
import { AnswersService } from '../../answers.service';
import { GetAnswersByResourceDto } from '../../dto';
import { randomUUID } from 'crypto';

describe('AnswersController - getAnswerByUser', () => {
  let controller: AnswersController;

  const mockService = {
    getAnswersByUser: jest.fn(),
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

    await controller.getAnswersByUser({ id: '' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
    expect(messages).toContain('O campo de id não pode estar vazio');
  });

  it('should throw error in DTO if ID is not a UUID', async () => {
    const dto = plainToInstance(GetAnswersByResourceDto, { id: 'invalid_id' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.getAnswersByUser({ id: 'invalid_id' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
  });

  it('should call service page and limit transformed', async () => {
    const uuid = randomUUID();
    const query = { page: '1', limit: '10', id: uuid };

    const dto = plainToInstance(GetAnswersByResourceDto, query);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.getAnswersByUser(dto);

    expect(mockService.getAnswersByUser).toHaveBeenCalledTimes(1);
    expect(mockService.getAnswersByUser).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      id: uuid,
    });
  });

  it('should return all answer of a user if the ID provided is valid', async () => {
    const uuid = randomUUID();
    const userId = randomUUID();
    const answerModel = {
      _data: [
        {
          ID_AN: uuid,
          ID_USER: userId,
          ID_QT: '71e4c72b-d55b-4a43-a03a-dae988ed30a9',
          RESPONSE: 'Pesquisa',
          VOTES: [],
          DT_CR: new Date(),
          DEL_AT: null,
          User: {
            USERNAME: 'Tauan',
            ROLE: 'ADMIN',
          },
          Question: {
            TITLE: 'Como criar um projeto nest js?',
            Category: {
              CATEGORY: 'Desenvolvimento',
            },
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
    mockService.getAnswersByUser.mockResolvedValue(answerModel);
    const result = await controller.getAnswersByUser({ id: userId });

    expect(mockService.getAnswersByUser).toHaveBeenCalledTimes(1);
    expect(mockService.getAnswersByUser).toHaveBeenCalledWith({ id: userId });
    expect(result).toEqual(answerModel);
  });
});
