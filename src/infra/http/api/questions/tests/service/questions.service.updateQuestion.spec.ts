import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaCategoryRespository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { QuestionsService } from '../../questions.service';
import { randomUUID } from 'crypto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { generateUpdatedPayload } from 'src/infra/http/user/tests/util/GeneratorUser.util';
import { UserRole } from '@prisma/client';

describe('QuestionsService - updateQuestion', () => {
  let service: QuestionsService;

  const mockRepository = {
    updateQuestion: jest.fn(),
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
    const uuid = randomUUID();
    const idQuestion = randomUUID();

    const updateQuestionModel = {
      title: 'Como criar projeto nest js',
      description: 'Dicas de como criar um projeto nest js',
      ID_CT: 'invalid-id',
    };

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });

    const questionByIdModel = {
      ID_QT: idQuestion,
      ID_USER: randomUUID(),
      ID_CT: '78fe6b53-6a8e-4b0c-8b80-901059b4af4b',
      TITLE: 'Como criar um projeto nest js?',
      DESCRIPTION: 'Quero dicas de como iniciar um projeto nest js',
      DT_CR: new Date(),
      DEL_AT: null,
      Category: {
        CATEGORY: 'Desenvolvimento',
      },
      User: {
        USERNAME: 'Tauan',
        ROLE: UserRole.USER,
      },
    };

    mockCategoryRepository.getCategoryById.mockResolvedValue(null);
    const getQuestionsById = jest.spyOn(service, 'getQuestionById');
    getQuestionsById.mockResolvedValue(questionByIdModel);

    try {
      await service.updateQuestion(loggedUser, idQuestion, updateQuestionModel);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Categoria não encontrada');
    }

    expect(mockCategoryRepository.getCategoryById).toHaveBeenCalledTimes(1);
    expect(mockCategoryRepository.getCategoryById).toHaveBeenCalledWith(updateQuestionModel.ID_CT);
    expect(getQuestionsById).toHaveBeenCalledTimes(1);
    expect(getQuestionsById).toHaveBeenCalledWith(idQuestion);
  });

  it('should throw NotFoundException if question not exists', async () => {
    const uuid = randomUUID();
    const idQuestion = randomUUID();

    const updateQuestionModel = {
      title: 'Como criar projeto nest js',
      description: 'Dicas de como criar um projeto nest js',
    };

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });
    const getQuestionsById = jest.spyOn(service, 'getQuestionById');
    getQuestionsById.mockRejectedValueOnce(new NotFoundException('Pergunta não encontrada'));

    try {
      await service.updateQuestion(loggedUser, idQuestion, updateQuestionModel);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Pergunta não encontrada');
    }

    expect(getQuestionsById).toHaveBeenCalledTimes(1);
    expect(getQuestionsById).toHaveBeenCalledWith(idQuestion);
  });

  it('should throw UnauthorizedException if not is the same user', async () => {
    const uuid = randomUUID();
    const idQuestion = randomUUID();

    const updateQuestionModel = {
      title: 'Como criar projeto nest js',
      description: 'Dicas de como criar um projeto nest js',
    };

    const questionByIdModel = {
      ID_QT: idQuestion,
      ID_USER: randomUUID(),
      ID_CT: '78fe6b53-6a8e-4b0c-8b80-901059b4af4b',
      TITLE: 'Como criar um projeto nest js?',
      DESCRIPTION: 'Quero dicas de como iniciar um projeto nest js',
      DT_CR: new Date(),
      DEL_AT: null,
      Category: {
        CATEGORY: 'Desenvolvimento',
      },
      User: {
        USERNAME: 'Tauan',
        ROLE: UserRole.USER,
      },
    };

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: 'malu',
      email: 'malu@example.com',
      role: 'USER',
    });
    const getQuestionsById = jest.spyOn(service, 'getQuestionById');
    getQuestionsById.mockResolvedValue(questionByIdModel);

    try {
      await service.updateQuestion(loggedUser, idQuestion, updateQuestionModel);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Você não pode alterar uma pergunta de outra pessoa');
    }

    expect(getQuestionsById).toHaveBeenCalledTimes(1);
    expect(getQuestionsById).toHaveBeenCalledWith(idQuestion);
  });

  it('should update a question with correct data', async () => {
    const uuid = randomUUID();
    const idQuestion = randomUUID();

    const updateQuestionModel = {
      title: 'Como criar projeto next js',
      description: 'Dicas de como criar um projeto next js',
    };

    const questionByIdModel = {
      ID_QT: idQuestion,
      ID_USER: uuid,
      ID_CT: '78fe6b53-6a8e-4b0c-8b80-901059b4af4b',
      TITLE: 'Como criar um projeto nest js?',
      DESCRIPTION: 'Quero dicas de como iniciar um projeto nest js',
      DT_CR: new Date(),
      DEL_AT: null,
      Category: {
        CATEGORY: 'Desenvolvimento',
      },
      User: {
        USERNAME: 'malu',
        ROLE: UserRole.USER,
      },
    };

    const updateQuestionResponse = {
      message: 'Pergunta editada com sucesso',
      data: {
        ID_QT: idQuestion,
        TITLE: 'Como criar projeto next js?',
        DESCRIPTION: 'Dicas de como criar um projeto next js',
        DT_CR: new Date(),
        DT_UP: new Date(),
        DEL_AT: null,
        ID_USER: uuid,
        ID_CT: '78fe6b53-6a8e-4b0c-8b80-901059b4af4b',
      },
    };

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: 'malu',
      email: 'malu@example.com',
      role: 'USER',
    });
    const getQuestionsById = jest.spyOn(service, 'getQuestionById');
    getQuestionsById.mockResolvedValue(questionByIdModel);
    mockRepository.updateQuestion.mockResolvedValue(updateQuestionResponse);

    const result = await service.updateQuestion(loggedUser, idQuestion, updateQuestionModel);

    expect(getQuestionsById).toHaveBeenCalledTimes(1);
    expect(getQuestionsById).toHaveBeenCalledWith(idQuestion);
    expect(mockRepository.updateQuestion).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateQuestion).toHaveBeenCalledWith(idQuestion, updateQuestionModel);

    expect(result).toEqual(updateQuestionResponse);
  });

  it('should update a question if user logged is ADMIN', async () => {
    const uuid = randomUUID();
    const otherUserId = randomUUID();
    const idQuestion = randomUUID();

    const updateQuestionModel = {
      title: 'Como criar projeto next js',
      description: 'Dicas de como criar um projeto next js',
    };

    const questionByIdModel = {
      ID_QT: idQuestion,
      ID_USER: uuid,
      ID_CT: '78fe6b53-6a8e-4b0c-8b80-901059b4af4b',
      TITLE: 'Como criar um projeto nest js?',
      DESCRIPTION: 'Quero dicas de como iniciar um projeto nest js',
      DT_CR: new Date(),
      DEL_AT: null,
      Category: {
        CATEGORY: 'Desenvolvimento',
      },
      User: {
        USERNAME: 'malu',
        ROLE: UserRole.USER,
      },
    };

    const updateQuestionResponse = {
      message: 'Pergunta editada com sucesso',
      data: {
        ID_QT: idQuestion,
        TITLE: 'Como criar projeto next js?',
        DESCRIPTION: 'Dicas de como criar um projeto next js',
        DT_CR: new Date(),
        DT_UP: new Date(),
        DEL_AT: null,
        ID_USER: uuid,
        ID_CT: '78fe6b53-6a8e-4b0c-8b80-901059b4af4b',
      },
    };

    const loggedUser = generateUpdatedPayload({
      sub: otherUserId,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'ADMIN',
    });
    const getQuestionsById = jest.spyOn(service, 'getQuestionById');
    getQuestionsById.mockResolvedValue(questionByIdModel);
    mockRepository.updateQuestion.mockResolvedValue(updateQuestionResponse);

    const result = await service.updateQuestion(loggedUser, idQuestion, updateQuestionModel);

    expect(getQuestionsById).toHaveBeenCalledTimes(1);
    expect(getQuestionsById).toHaveBeenCalledWith(idQuestion);
    expect(mockRepository.updateQuestion).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateQuestion).toHaveBeenCalledWith(idQuestion, updateQuestionModel);

    expect(result).toEqual(updateQuestionResponse);
  });
});
