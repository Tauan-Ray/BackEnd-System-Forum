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

describe('QuestionsService - deleteQuestion', () => {
  let service: QuestionsService;

  const mockRepository = {
    deleteQuestion: jest.fn(),
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
    const idQuestion = randomUUID();

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });
    const getQuestionsById = jest.spyOn(service, 'getQuestionById');
    getQuestionsById.mockRejectedValueOnce(new NotFoundException('Pergunta não encontrada'));

    try {
      await service.deleteQuestion(idQuestion, loggedUser);
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
      await service.deleteQuestion(idQuestion, loggedUser);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Você não pode deletar uma pergunta de outra pessoa');
    }

    expect(getQuestionsById).toHaveBeenCalledTimes(1);
    expect(getQuestionsById).toHaveBeenCalledWith(idQuestion);
  });

  it('should update a question with correct data', async () => {
    const uuid = randomUUID();
    const idQuestion = randomUUID();

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

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: 'malu',
      email: 'malu@example.com',
      role: 'USER',
    });
    const getQuestionsById = jest.spyOn(service, 'getQuestionById');
    getQuestionsById.mockResolvedValue(questionByIdModel);

    const result = await service.deleteQuestion(idQuestion, loggedUser);

    expect(getQuestionsById).toHaveBeenCalledTimes(1);
    expect(getQuestionsById).toHaveBeenCalledWith(idQuestion);
    expect(mockRepository.deleteQuestion).toHaveBeenCalledTimes(1);
    expect(mockRepository.deleteQuestion).toHaveBeenCalledWith(idQuestion);

    expect(result).toEqual({ message: 'Pergunta deletada com sucesso' });
  });

  it('should update a question if user logged is ADMIN', async () => {
    const uuid = randomUUID();
    const otherUserId = randomUUID();
    const idQuestion = randomUUID();

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

    const loggedUser = generateUpdatedPayload({
      sub: otherUserId,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'ADMIN',
    });
    const getQuestionsById = jest.spyOn(service, 'getQuestionById');
    getQuestionsById.mockResolvedValue(questionByIdModel);

    const result = await service.deleteQuestion(idQuestion, loggedUser);

    expect(getQuestionsById).toHaveBeenCalledTimes(1);
    expect(getQuestionsById).toHaveBeenCalledWith(idQuestion);
    expect(mockRepository.deleteQuestion).toHaveBeenCalledTimes(1);
    expect(mockRepository.deleteQuestion).toHaveBeenCalledWith(idQuestion);

    expect(result).toEqual({ message: 'Pergunta deletada com sucesso' });
  });
});
