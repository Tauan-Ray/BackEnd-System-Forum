import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaCategoryRespository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { QuestionsService } from '../../questions.service';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

describe('QuestionsService - getQuestionsByIdUser', () => {
  let service: QuestionsService;

  const mockRepository = {
    createQuestion: jest.fn(),
  };

  const mockCategoryRepository = {
    getCategoryById: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: PrismaQuestionsRepository,
          useValue: mockRepository,
        },
        { provide: PrismaCategoryRespository, useValue: mockCategoryRepository },
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

  it('should throw NotFoundException if category not exists', async () => {
    const createQuestionModel = {
      title: 'Como criar projeto nest js',
      description: 'Dicas de como criar um projeto nest js',
      ID_CT: 'invalid-id',
    };
    mockCategoryRepository.getCategoryById.mockResolvedValue(null);

    try {
      await service.createQuestion(randomUUID(), createQuestionModel);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Categoria não encontrada');
    }

    expect(mockCategoryRepository.getCategoryById).toHaveBeenCalledTimes(1);
    expect(mockCategoryRepository.getCategoryById).toHaveBeenCalledWith(createQuestionModel.ID_CT);
  });

  it('should create a question with correct data', async () => {
    const uuid = randomUUID();
    const categoryModel = {
      ID_CT: '78fe6b53-6a8e-4b0c-8b80-901059b4af4b',
      CATEGORY: 'Desenvolvimento',
      DT_CR: '2025-10-23T17:46:43.189Z',
      DT_UP: '2025-10-23T17:46:43.189Z',
      DEL_AT: null,
    };

    const createQuestionModel = {
      title: 'Como criar projeto nest js',
      description: 'Dicas de como criar um projeto nest js',
      ID_CT: categoryModel.ID_CT,
    };

    mockCategoryRepository.getCategoryById.mockResolvedValue(categoryModel);

    const createdQuestionData = {
      ID_QT: randomUUID(),
      TITLE: createQuestionModel.title,
      DESCRIPTION: createQuestionModel.description,
      DT_CR: new Date(),
      DT_UP: new Date(),
      DEL_AT: null,
      ID_USER: uuid,
      ID_CT: categoryModel.ID_CT,
    };

    mockRepository.createQuestion.mockResolvedValue({
      message: 'Pergunta criada com sucesso',
      data: createdQuestionData,
    });

    const result = await service.createQuestion(uuid, createQuestionModel);

    expect(mockCategoryRepository.getCategoryById).toHaveBeenCalledTimes(1);
    expect(mockCategoryRepository.getCategoryById).toHaveBeenCalledWith(createQuestionModel.ID_CT);

    expect(mockRepository.createQuestion).toHaveBeenCalledTimes(1);
    expect(mockRepository.createQuestion).toHaveBeenCalledWith(uuid, createQuestionModel);

    expect(result).toEqual({
      message: 'Pergunta criada com sucesso',
      data: createdQuestionData,
    });
  });
});
