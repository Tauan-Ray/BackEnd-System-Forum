import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from '../../questions.controller';
import { QuestionsService } from '../../questions.service';
import { JwtGuard, ThrottlerConfigGuard } from 'src/common/guards';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateQuestionDto } from '../../dto/update-question.dto';
import { randomUUID } from 'crypto';
import { generateUpdatedPayload } from 'src/infra/http/user/tests/util/GeneratorUser.util';

describe('QuestionsController - updateQuestion', () => {
  let controller: QuestionsController;

  const mockService = {
    updateQuestion: jest.fn(),
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

  it('should throw error in DTO if title is too short', async () => {
    const uuid = randomUUID();
    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });

    const dataUpdateQuestion = {
      title: 'Oi',
      description: 'teste de criacao',
      ID_CT: randomUUID(),
    };

    const dto = plainToInstance(UpdateQuestionDto, { title: 'Oi' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.updateQuestion(loggedUser, { id: randomUUID() }, dataUpdateQuestion);

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O titulo deve conter no mínimo 5 caracteres e no máximo 60');
  });

  it('should throw error in DTO if ID_CT is invalid', async () => {
    const uuid = randomUUID();
    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });

    const dataUpdateQuestion = {
      title: 'Titulo valido',
      description: 'descricao valida',
      ID_CT: '123',
    };
    const dto = plainToInstance(UpdateQuestionDto, { ID_CT: '123' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.updateQuestion(loggedUser, { id: randomUUID() }, dataUpdateQuestion);

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('ID_CT must be a UUID');
  });

  it('should update question successfully if data is valid', async () => {
    const uuid = randomUUID();
    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });

    const questionId = randomUUID();
    const updateData = {
      title: 'Como integrar Prisma com NestJS?',
      description: 'Gostaria de atualizar o título e conteúdo desta questão.',
      ID_CT: randomUUID(),
    };

    const dto = plainToInstance(UpdateQuestionDto, updateData);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    const updatedQuestion = {
      ID_QUESTION: questionId,
      TITLE: updateData.title,
      DESCRIPTION: updateData.description,
      ID_CT: updateData.ID_CT,
      DT_UP: new Date(),
    };

    mockService.updateQuestion.mockResolvedValue(updatedQuestion);

    const result = await controller.updateQuestion(loggedUser, { id: questionId }, updateData);

    expect(mockService.updateQuestion).toHaveBeenCalledTimes(1);
    expect(mockService.updateQuestion).toHaveBeenCalledWith(loggedUser, questionId, updateData);
    expect(result).toEqual(updatedQuestion);
  });
});
