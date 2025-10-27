import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/common/guards';
import { ThrottlerConfigGuard } from 'src/common/guards/throttler-config.guard';
import { AnswersController } from '../../answers.controller';
import { AnswersService } from '../../answers.service';
import { plainToInstance, Type } from 'class-transformer';
import { GetIdParamDto, UpdateVoteDto } from '../../dto';
import { randomUUID } from 'crypto';
import { validate } from 'class-validator';
import { generateUpdatedPayload } from 'src/infra/http/user/tests/util/GeneratorUser.util';
import { TypeVotes } from '@prisma/client';

describe('AnswersController - updateVote', () => {
  let controller: AnswersController;

  const mockService = {
    updateVotes: jest.fn(),
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
    const uuid = randomUUID();
    const questionId = randomUUID();
    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });

    const dto = plainToInstance(GetIdParamDto, { id: '' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.updateVotes(
      loggedUser,
      { id: questionId },
      plainToInstance(UpdateVoteDto, { type: TypeVotes.LIKE }),
    );

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
    expect(messages).toContain('O campo de id não pode estar vazio');
  });

  it('should update vote successfully if data is valid', async () => {
    const uuid = randomUUID();
    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });

    const questionId = randomUUID();

    const dto = plainToInstance(UpdateVoteDto, { type: TypeVotes.LIKE });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    const updatedVote = { message: 'Voto criado' };

    mockService.updateVotes.mockResolvedValue(updatedVote);

    const result = await controller.updateVotes(loggedUser, { id: questionId }, dto);

    expect(mockService.updateVotes).toHaveBeenCalledTimes(1);
    expect(mockService.updateVotes).toHaveBeenCalledWith(loggedUser, questionId, dto);
    expect(result).toEqual(updatedVote);
  });
});
