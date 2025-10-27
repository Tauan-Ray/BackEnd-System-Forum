import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaAnswersRepository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { randomUUID } from 'crypto';
import { AnswersService } from '../../answers.service';
import { NotFoundException } from '@nestjs/common';

describe('AnswersService - getAnswerByUser', () => {
  let service: AnswersService;

  const mockRepository = {
    getAnswersByUser: jest.fn(),
  };

  const mockUserRepository = {
    findById: jest.fn(),
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
        { provide: PrismaUserRepository, useValue: mockUserRepository },
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

  it('should throw NotFoundException if user not exists', async () => {
    const uuid = randomUUID();
    mockUserRepository.findById.mockResolvedValue(null);

    try {
      await service.getAnswersByUser({ id: uuid });
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Usuário não encontrado');
    }

    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(uuid);
  });

  it('should return all questions of a user', async () => {
    const uuid = randomUUID();
    const idUser = randomUUID();
    const answersModel = {
      _data: [
        {
          ID_AN: randomUUID(),
          ID_USER: idUser,
          ID_QT: randomUUID(),
          RESPONSE: 'Pesquisa',
          VOTES: [],
          DT_CR: '2025-10-27T16:58:49.624Z',
          DEL_AT: null,
          User: {
            USERNAME: 'Tauan Admin',
            ROLE: 'ADMIN',
          },
          Question: {
            TITLE: 'Como criar um projeto nest js?',
            Category: {
              CATEGORY: 'Desenvolvimento',
            },
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
      ID_USER: uuid,
      USERNAME: 'Tauan Admin',
      NAME: 'Tauan admin',
      ROLE: 'ADMIN',
      DT_CR: new Date(),
    };

    mockUserRepository.findById.mockResolvedValue(userModel);
    mockRepository.getAnswersByUser.mockResolvedValue(answersModel);

    const result = await service.getAnswersByUser({ id: uuid });

    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(uuid);

    expect(mockRepository.getAnswersByUser).toHaveBeenCalledTimes(1);
    expect(mockRepository.getAnswersByUser).toHaveBeenCalledWith({ id: uuid });

    expect(result).toEqual(answersModel);
  });
});
