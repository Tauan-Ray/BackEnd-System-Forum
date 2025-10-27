import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/common/guards';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';
import { AnswersController } from '../../answers.controller';
import { AnswersService } from '../../answers.service';
import { GetIdParamDto } from '../../dto';
import { randomUUID } from 'crypto';

describe('AnswersController - getAnswerById', () => {
  let controller: AnswersController;

  const mockService = {
    getAnswerById: jest.fn(),
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
    const dto = plainToInstance(GetIdParamDto, { id: '' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.getAnswerById({ id: '' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
    expect(messages).toContain('O campo de id não pode estar vazio');
  });

  it('should throw error in DTO if ID is not a UUID', async () => {
    const dto = plainToInstance(GetIdParamDto, { id: 'invalid_id' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.getAnswerById({ id: 'invalid_id' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
  });

  it('should return a answer if the ID provided is valid', async () => {
    const userId = randomUUID();
    const idQuestion = randomUUID();
    const idAnswer = randomUUID();

    const answerModel = {
      ID_AN: idAnswer,
      ID_USER: userId,
      ID_QT: idQuestion,
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
    };
    mockService.getAnswerById.mockResolvedValue(answerModel);
    const result = await controller.getAnswerById({ id: idAnswer });

    expect(mockService.getAnswerById).toHaveBeenCalledTimes(1);
    expect(mockService.getAnswerById).toHaveBeenCalledWith(idAnswer);
    expect(result).toEqual(answerModel);
  });
});
