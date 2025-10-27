import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/common/guards';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';
import { AnswersController } from '../../answers.controller';
import { AnswersService } from '../../answers.service';
import { plainToInstance } from 'class-transformer';
import { CreateAnswerDto } from '../../dto';
import { randomUUID } from 'crypto';
import { validate } from 'class-validator';
import { generateUpdatedPayload } from 'src/infra/http/user/tests/util/GeneratorUser.util';

describe('AnswersController - createAnswer', () => {
  let controller: AnswersController;

  const mockService = {
    createAnswer: jest.fn(),
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

  it('should throw validation error if response is empty', async () => {
    const dto = plainToInstance(CreateAnswerDto, {
      response: '',
      ID_CT: randomUUID(),
    });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('A resposta não pode ser vazia');
  });

  it('should create a question successfully if data is valid', async () => {
    const uuid = randomUUID();
    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });

    const data = {
      response: 'Pesquisa',
      ID_QT: randomUUID(),
    };

    const dto = plainToInstance(CreateAnswerDto, data);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    const createdQuestion = {
      message: 'Resposta criada com sucesso',
      data: {
        ID_AN: randomUUID(),
        RESPONSE: 'Pesquisa',
        DT_CR: new Date(),
        DT_UP: null,
        DEL_AT: null,
        ID_USER: uuid,
        ID_QT: '71e4c72b-d55b-4a43-a03a-dae988ed30a9',
      },
    };

    mockService.createAnswer.mockResolvedValue(createdQuestion);

    const result = await controller.createAnswer(loggedUser, data);

    expect(mockService.createAnswer).toHaveBeenCalledTimes(1);
    expect(mockService.createAnswer).toHaveBeenCalledWith(loggedUser.sub, data);
    expect(result).toEqual(createdQuestion);
  });
});
