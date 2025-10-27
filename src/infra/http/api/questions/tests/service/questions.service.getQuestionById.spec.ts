import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaCategoryRespository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { QuestionsService } from '../../questions.service';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

describe('QuestionsService - getAllQuestions', () => {
  let service: QuestionsService;

  const mockRepository = {
    getQuestionById: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: PrismaQuestionsRepository,
          useValue: mockRepository,
        },
        { provide: PrismaCategoryRespository, useValue: {} },
        { provide: PrismaUserRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if question not exists', async () => {
    const uuid = randomUUID();
    mockRepository.getQuestionById.mockResolvedValue(null);

    try {
      await service.getQuestionById(uuid);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Pergunta não encontrada');
    }

    expect(mockRepository.getQuestionById).toHaveBeenCalledTimes(1);
    expect(mockRepository.getQuestionById).toHaveBeenCalledWith(uuid);
  });

  it('should return a question if exists', async () => {
    const uuid = randomUUID();
    const idUser = randomUUID();
    const questionModel = {
      ID_QT: uuid,
      ID_USER: idUser,
      ID_CT: '78fe6b53-6a8e-4b0c-8b80-901059b4af4b',
      TITLE: 'Como criar um projeto next js?',
      DESCRIPTION: 'Quero dicas de como iniciar um projeto next js',
      DT_CR: new Date(),
      DEL_AT: null,
      Category: {
        CATEGORY: 'Desenvolvimento',
      },
      User: {
        USERNAME: 'Tauan',
        ROLE: 'ADMIN',
      },
    };

    mockRepository.getQuestionById.mockResolvedValue(questionModel);

    const result = await service.getQuestionById(uuid);

    expect(mockRepository.getQuestionById).toHaveBeenCalledTimes(1);
    expect(mockRepository.getQuestionById).toHaveBeenCalledWith(uuid);

    expect(result).toEqual(questionModel);
  });
});
