import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaAnswersRepository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { AnswersService } from '../../answers.service';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';
import { TypeVotes, UserRole } from '@prisma/client';

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

    const answerByIdModel = {
      ID_AN: '208c1326-e90b-4e75-9432-74e67916a4b2',
      ID_USER: '53103970-7493-4a94-b3e5-9fa72a9164a1',
      ID_QT: '71e4c72b-d55b-4a43-a03a-dae988ed30a9',
      RESPONSE: 'Pesquisa',
      VOTES: [
        {
          TYPE: TypeVotes.LIKE,
          ID_USER: '53103970-7493-4a94-b3e5-9fa72a91641',
        },
      ],
      DT_CR: new Date(),
      DEL_AT: null,
      User: {
        USERNAME: '_tauankk',
        ROLE: UserRole.USER,
      },
      Question: {
        TITLE: 'Como criar um projeto nest js?',
        Category: {
          CATEGORY: 'Desenvolvimento',
        },
      },
    };

    const votesModel = {
      ID_AN: idAnswer,
      LIKES: 10,
      DESLIKES: 2,
    };
    const getAnswerById = jest.spyOn(service, 'getAnswerById');
    getAnswerById.mockResolvedValue(answerByIdModel);

    mockRepository.getVotesByAnswer.mockResolvedValue(votesModel);

    const result = await service.getVotesByAnswer(idAnswer);

    expect(mockRepository.getVotesByAnswer).toHaveBeenCalledTimes(1);
    expect(mockRepository.getVotesByAnswer).toHaveBeenCalledWith(idAnswer);

    expect(result).toEqual(votesModel);
  });

  it('should throw NotFoundException if answer not exists', async () => {
    const idAnswer = randomUUID();

    const getAnswerById = jest.spyOn(service, 'getAnswerById');
    getAnswerById.mockRejectedValueOnce(new NotFoundException('Resposta não encontrada'));

    try {
      await service.getVotesByAnswer(idAnswer);
      throw Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Resposta não encontrada');
    }
  });
});
