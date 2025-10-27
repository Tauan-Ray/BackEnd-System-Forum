import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/common/guards';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';
import { AnswersController } from '../../answers.controller';
import { AnswersService } from '../../answers.service';
import { plainToInstance } from 'class-transformer';
import { UpdateAnswerDto } from '../../dto';
import { randomUUID } from 'crypto';
import { validate } from 'class-validator';
import { generateUpdatedPayload } from 'src/infra/http/user/tests/util/GeneratorUser.util';

describe('AnswersController - updateAnswer', () => {
  let controller: AnswersController;

  const mockService = {
    updateAnswer: jest.fn(),
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

  it('should throw error in DTO if response is empty', async () => {
    const uuid = randomUUID();
    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });

    const dataUpdateQuestion = {
      response: '',
    };
    const dto = plainToInstance(UpdateAnswerDto, dataUpdateQuestion);
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.updateAnswer(loggedUser, { id: randomUUID() }, dataUpdateQuestion);

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('A resposta não pode ser vazia');
  });

  it('should update answer successfully if data is valid', async () => {
    const uuid = randomUUID();
    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });

    const answerId = randomUUID();
    const updateData = {
      response: 'Atualizando resposta',
    };

    const dto = plainToInstance(UpdateAnswerDto, updateData);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    const updatedAnswer = {
      message: 'Resposta atualizada com sucesso',
      data: {
        ID_AN: answerId,
        RESPONSE: 'Atualizando resposta',
        DT_CR: new Date(),
        DT_UP: null,
        DEL_AT: null,
        ID_USER: uuid,
        ID_QT: '71e4c72b-d55b-4a43-a03a-dae988ed30a9',
      },
    };

    mockService.updateAnswer.mockResolvedValue(updatedAnswer);

    const result = await controller.updateAnswer(loggedUser, { id: answerId }, updateData);

    expect(mockService.updateAnswer).toHaveBeenCalledTimes(1);
    expect(mockService.updateAnswer).toHaveBeenCalledWith(loggedUser, answerId, updateData);
    expect(result).toEqual(updatedAnswer);
  });
});
