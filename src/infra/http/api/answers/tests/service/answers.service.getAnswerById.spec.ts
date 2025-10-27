import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaAnswersRepository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { randomUUID } from 'crypto';
import { AnswersService } from '../../answers.service';
import { NotFoundException } from '@nestjs/common';

describe('AnswersService - getAnswersById', () => {
  let service: AnswersService;

  const mockRepository = {
    getAnswerById: jest.fn(),
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

  it('should throw NotFoundException if answer not exists', async () => {
    const uuid = randomUUID();
    mockRepository.getAnswerById.mockResolvedValue(null);

    try {
      await service.getAnswerById(uuid);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Resposta não encontrada');
    }

    expect(mockRepository.getAnswerById).toHaveBeenCalledTimes(1);
    expect(mockRepository.getAnswerById).toHaveBeenCalledWith(uuid);
  });

  it('should return a answer if exists', async () => {
    const uuid = randomUUID();
    const idUser = randomUUID();
    const answerModel = {
      ID_AN: uuid,
      ID_USER: idUser,
      ID_QT: randomUUID(),
      RESPONSE: 'Pesquisa',
      VOTES: [],
      DT_CR: new Date(),
      DEL_AT: null,
      User: {
        USERNAME: 'Tauan',
        ROLE: 'ADMIN',
      },
      Question: {
        TITLE: 'Como criar um projeto nest js?',
        Category: {
          CATEGORY: 'Desenvolvimento',
        },
      },
    };

    mockRepository.getAnswerById.mockResolvedValue(answerModel);

    const result = await service.getAnswerById(uuid);

    expect(mockRepository.getAnswerById).toHaveBeenCalledTimes(1);
    expect(mockRepository.getAnswerById).toHaveBeenCalledWith(uuid);

    expect(result).toEqual(answerModel);
  });
});
