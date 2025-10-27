import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaAnswersRepository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { randomUUID } from 'crypto';
import { AnswersService } from '../../answers.service';
import { NotFoundException } from '@nestjs/common';

describe('AnswersService - createAnswer', () => {
  let service: AnswersService;

  const mockRepository = {
    createAnswer: jest.fn(),
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

    const createAnswerModel = {
      response: 'Teste de response',
      ID_QT: 'invalid-id',
    };

    try {
      await service.createAnswer(uuid, createAnswerModel);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Pergunta não encontrada');
    }

    expect(mockQuestionRepository.getQuestionById).toHaveBeenCalledTimes(1);
    expect(mockQuestionRepository.getQuestionById).toHaveBeenCalledWith('invalid-id');
  });

  it('should create a answer with correct data', async () => {
    const uuid = randomUUID();
    const idUser = randomUUID();

    const createdAnswer = {
      message: 'Resposta criada com sucesso',
      data: {
        ID_AN: randomUUID(),
        RESPONSE: 'Pesquisa',
        DT_CR: new Date(),
        DT_UP: null,
        DEL_AT: null,
        ID_USER: idUser,
        ID_QT: uuid,
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

    const createAnswerModel = {
      response: 'Teste de response',
      ID_QT: uuid,
    };

    mockQuestionRepository.getQuestionById.mockResolvedValue(questionModel);
    mockRepository.createAnswer.mockResolvedValue(createdAnswer);

    const result = await service.createAnswer(idUser, createAnswerModel);

    expect(mockQuestionRepository.getQuestionById).toHaveBeenCalledTimes(1);
    expect(mockQuestionRepository.getQuestionById).toHaveBeenCalledWith(uuid);

    expect(mockRepository.createAnswer).toHaveBeenCalledTimes(1);
    expect(mockRepository.createAnswer).toHaveBeenCalledWith(idUser, createAnswerModel);

    expect(result).toEqual(createdAnswer);
  });
});
