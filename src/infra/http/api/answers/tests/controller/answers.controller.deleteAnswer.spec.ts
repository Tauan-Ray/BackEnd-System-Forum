import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/common/guards';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';
import { plainToInstance } from 'class-transformer';
import { GetIdParamDto } from '../../dto';
import { validate } from 'class-validator';
import { randomUUID } from 'crypto';
import { generateUpdatedPayload } from 'src/infra/http/user/tests/util/GeneratorUser.util';
import { AnswersController } from '../../answers.controller';
import { AnswersService } from '../../answers.service';

describe('AnswersController - deleteAnswer', () => {
  let controller: AnswersController;

  const mockService = {
    deleteAnswer: jest.fn(),
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

  it('should call service with correct parameters', async () => {
    const uuid = randomUUID();
    const answerId = randomUUID();
    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });

    const dto = plainToInstance(GetIdParamDto, { id: answerId });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.deleteAnswer(loggedUser, { id: answerId });

    expect(mockService.deleteAnswer).toHaveBeenCalledTimes(1);
    expect(mockService.deleteAnswer).toHaveBeenCalledWith(loggedUser, answerId);
  });
});
