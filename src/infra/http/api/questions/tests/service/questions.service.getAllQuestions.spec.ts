import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaCategoryRespository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { randomUUID } from 'crypto';
import { QuestionsService } from '../../questions.service';

describe('QuestionsService - getAllQuestions', () => {
  let service: QuestionsService;

  const mockRepository = {
    getAllQuestions: jest.fn(),
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

  it('should return all questions', async () => {
    const uuid = randomUUID();
    const idUser = randomUUID();
    const questionsModel = {
      _data: [
        {
          ID_QT: uuid,
          ID_USER: idUser,
          ID_CT: '78fe6b53-6a8e-4b0c-8b80-901059b4af4b',
          TITLE: 'Como criar um projeto next js?',
          DESCRIPTION: 'Quero dicas de como iniciar um projeto next js',
          DT_CR: new Date(),
          Category: {
            CATEGORY: 'Desenvolvimento',
          },
          User: {
            USERNAME: 'Tauan',
            ROLE: 'ADMIN',
          },
        },
      ],
      _meta: {
        _results: 1,
        _total_results: 1,
        _page: 1,
        _total_page: 1,
      },
    };

    mockRepository.getAllQuestions.mockResolvedValue(questionsModel);
    const result = await service.getAllQuestions({});

    expect(mockRepository.getAllQuestions).toHaveBeenCalledTimes(1);
    expect(result).toEqual(questionsModel);
  });
});
