import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/common/guards';
import { QuestionsController } from '../../questions.controller';
import { QuestionsService } from '../../questions.service';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';
import { plainToInstance } from 'class-transformer';
import { GetIdParamDto } from '../../dto';
import { validate } from 'class-validator';
import { randomUUID } from 'crypto';

describe('QuestionsController - getQuestionById', () => {
  let controller: QuestionsController;

  const mockService = {
    getQuestionById: jest.fn(),
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
    const dto = plainToInstance(GetIdParamDto, { id: '' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.getQuestionById({ id: '' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
    expect(messages).toContain('O campo de id não pode estar vazio');
  });

  it('should throw error in DTO if ID is not a UUID', async () => {
    const dto = plainToInstance(GetIdParamDto, { id: 'invalid_id' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.getQuestionById({ id: 'invalid_id' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
  });

  it('should return a question if the ID provided is valid', async () => {
    const uuid = randomUUID();
    const userId = randomUUID();
    const questionModel = {
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
    };
    mockService.getQuestionById.mockResolvedValue(questionModel);
    const result = await controller.getQuestionById({ id: uuid });

    expect(mockService.getQuestionById).toHaveBeenCalledTimes(1);
    expect(mockService.getQuestionById).toHaveBeenCalledWith(uuid);
    expect(result).toEqual(questionModel);
  });
});
