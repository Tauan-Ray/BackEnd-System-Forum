import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/common/guards';
import { QuestionsController } from '../../questions.controller';
import { QuestionsService } from '../../questions.service';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';
import { plainToInstance } from 'class-transformer';
import { GetIdParamDto } from '../../dto';
import { validate } from 'class-validator';
import { randomUUID } from 'crypto';
import { generateUpdatedPayload } from 'src/infra/http/user/tests/util/GeneratorUser.util';

describe('QuestionsController - getQuestionsByIdUser', () => {
  let controller: QuestionsController;

  const mockService = {
    deleteQuestion: jest.fn(),
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

  it('should call service with correct parameters', async () => {
    const uuid = randomUUID();
    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });

    const dto = plainToInstance(GetIdParamDto, { id: loggedUser.sub });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.deleteQuestion(loggedUser, { id: loggedUser.sub });

    expect(mockService.deleteQuestion).toHaveBeenCalledTimes(1);
    expect(mockService.deleteQuestion).toHaveBeenCalledWith(loggedUser.sub, loggedUser);
  });
});
