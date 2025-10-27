import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from '../../questions.controller';
import { QuestionsService } from '../../questions.service';
import { JwtGuard, ThrottlerConfigGuard } from 'src/common/guards';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateQuestionDto } from '../../dto';
import { randomUUID } from 'crypto';
import { generateUpdatedPayload } from 'src/infra/http/user/tests/util/GeneratorUser.util';

describe('QuestionsController - createQuestion', () => {
  let controller: QuestionsController;

  const mockService = {
    createQuestion: jest.fn(),
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

  it('should throw validation error if required fields are missing', async () => {
    const dto = plainToInstance(CreateQuestionDto, {
      title: '',
      description: '',
      ID_CT: '',
    });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O titulo deve conter no mínimo 5 caracteres e no máximo 60');
    expect(messages).toContain('A descrição deve conter no mínimo 5 caracteres e no máximo 255');
    expect(messages).toContain('ID_CT must be a UUID');
  });

  it('should throw validation error if title is too short', async () => {
    const dto = plainToInstance(CreateQuestionDto, {
      title: 'Oi',
      description: 'Descrição válida da pergunta',
      ID_CT: randomUUID(),
    });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O titulo deve conter no mínimo 5 caracteres e no máximo 60');
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
      title: 'Como usar o NestJS com Prisma?',
      description: 'Gostaria de entender como configurar o Prisma no NestJS.',
      ID_CT: randomUUID(),
    };

    const dto = plainToInstance(CreateQuestionDto, data);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    const createdQuestion = {
      ID_QUESTION: randomUUID(),
      TITLE: data.title,
      DESCRIPTION: data.description,
      ID_CT: data.ID_CT,
      USER_ID: loggedUser.sub,
      DT_CR: new Date(),
      DT_UP: new Date(),
    };

    mockService.createQuestion.mockResolvedValue(createdQuestion);

    const result = await controller.createQuestion(loggedUser, data);

    expect(mockService.createQuestion).toHaveBeenCalledTimes(1);
    expect(mockService.createQuestion).toHaveBeenCalledWith(loggedUser.sub, data);
    expect(result).toEqual(createdQuestion);
  });
});
