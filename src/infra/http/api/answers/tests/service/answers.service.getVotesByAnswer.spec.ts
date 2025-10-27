import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaAnswersRepository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { AnswersService } from '../../answers.service';
import { randomUUID } from 'crypto';

describe('AnswersService - getVotesByAnswer', () => {
  let service: AnswersService;

  const mockRepository = {
    getVotesByAnswer: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswersService,
        {
          provide: PrismaAnswersRepository,
          useValue: mockRepository,
        },
        { provide: PrismaQuestionsRepository, useValue: {} },
        { provide: PrismaUserRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<AnswersService>(AnswersService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return quantity of likes and deslikes of a answer', async () => {
    const idAnswer = randomUUID();

    const votesModel = {
      ID_AN: idAnswer,
      LIKES: 10,
      DESLIKES: 2,
    };
    mockRepository.getVotesByAnswer.mockResolvedValue(votesModel);
    const result = await service.getVotesByAnswer(idAnswer);

    expect(mockRepository.getVotesByAnswer).toHaveBeenCalledTimes(1);
    expect(mockRepository.getVotesByAnswer).toHaveBeenCalledWith(idAnswer);

    expect(result).toEqual(votesModel);
  });
});
