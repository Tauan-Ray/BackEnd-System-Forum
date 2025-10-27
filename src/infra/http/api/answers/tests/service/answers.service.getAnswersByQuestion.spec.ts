import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaAnswersRepository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { randomUUID } from 'crypto';
import { AnswersService } from '../../answers.service';
import { NotFoundException } from '@nestjs/common';

describe('AnswersService - getAnswerByQuestion', () => {
  let service: AnswersService;

  const mockRepository = {
    getAnswersByQuestion: jest.fn(),
  };

  const mockQuestionRepository = {
    getQuestionById: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswersService,
        {
          provide: PrismaAnswersRepository,
          useValue: mockRepository,
        },
        { provide: PrismaQuestionsRepository, useValue: mockQuestionRepository },
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

  it('should throw NotFoundException if question not exists', async () => {
    const uuid = randomUUID();
    mockQuestionRepository.getQuestionById.mockResolvedValue(null);

    try {
      await service.getAnswersByQuestion({ id: uuid });
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Pergunta não encontrada');
    }

    expect(mockQuestionRepository.getQuestionById).toHaveBeenCalledTimes(1);
    expect(mockQuestionRepository.getQuestionById).toHaveBeenCalledWith(uuid);
  });

  it('should return all questions of a user', async () => {
    const uuid = randomUUID();
    const answersModel = {
      _data: [
        {
          ID_AN: randomUUID(),
          ID_QT: uuid,
          RESPONSE: 'Pesquisa',
          DT_CR: new Date(),
          USERNAME: 'Tauan Admin',
          ROLE: 'ADMIN',
          TITLE: 'Como criar um projeto nest js?',
          CATEGORY: 'Desenvolvimento',
          likes: 0,
          dislikes: 0,
        },
      ],
      _meta: {
        _results: 1,
        _total_results: 1,
        _page: 1,
        _total_page: 1,
      },
    };

    const questionModel = {
      ID_QT: uuid,
      ID_USER: randomUUID(),
      ID_CT: '78fe6b53-6a8e-4b0c-8b80-901059b4af4b',
      TITLE: 'Como criar um projeto nest js?',
      DESCRIPTION:
        'Gostaria de saber como posso criar uma projeto utilizando o framework NestJS como admin ',
      DT_CR: new Date(),
      DEL_AT: null,
      Category: {
        CATEGORY: 'Desenvolvimento',
      },
      User: {
        USERNAME: 'Tauan Admin',
        ROLE: 'ADMIN',
      },
    };

    mockQuestionRepository.getQuestionById.mockResolvedValue(questionModel);
    mockRepository.getAnswersByQuestion.mockResolvedValue(answersModel);

    const result = await service.getAnswersByQuestion({ id: uuid });

    expect(mockQuestionRepository.getQuestionById).toHaveBeenCalledTimes(1);
    expect(mockQuestionRepository.getQuestionById).toHaveBeenCalledWith(uuid);

    expect(mockRepository.getAnswersByQuestion).toHaveBeenCalledTimes(1);
    expect(mockRepository.getAnswersByQuestion).toHaveBeenCalledWith({ id: uuid });

    expect(result).toEqual(answersModel);
  });
});
