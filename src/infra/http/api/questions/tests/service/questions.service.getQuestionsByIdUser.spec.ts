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
    getQuestionsByIdUser: jest.fn(),
  };

  const mockUserRepository = {
    findById: jest.fn(),
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
        { provide: PrismaUserRepository, useValue: mockUserRepository },
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

  it('should throw NotFoundException if user not exists', async () => {
    const uuid = randomUUID();
    mockUserRepository.findById.mockResolvedValue(null);

    try {
      await service.getQuestionsByIdUser({ id: uuid });
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Usuário não encontrado');
    }

    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(uuid);
  });

  it('should return a question if exists', async () => {
    const uuid = randomUUID();
    const idUser = randomUUID();
    const questionModel = {
      _data: [
        {
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
        },
      ],
      _meta: {
        _results: 1,
        _total_results: 1,
        _page: 1,
        _total_page: 1,
      },
    };

    const userModel = {
      ID_USER: '53103970-7493-4a94-b3e5-9fa72a9164a1',
      USERNAME: 'Tauan Admin',
      NAME: 'Tauan admin',
      ROLE: 'ADMIN',
      DT_CR: new Date(),
    };

    mockUserRepository.findById.mockResolvedValue(userModel);
    mockRepository.getQuestionsByIdUser.mockResolvedValue(questionModel);

    const result = await service.getQuestionsByIdUser({ id: uuid });

    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(uuid);

    expect(mockRepository.getQuestionsByIdUser).toHaveBeenCalledTimes(1);
    expect(mockRepository.getQuestionsByIdUser).toHaveBeenCalledWith({ id: uuid });

    expect(result).toEqual(questionModel);
  });
});
