import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaAnswersRepository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { randomUUID } from 'crypto';
import { AnswersService } from '../../answers.service';

describe('AnswersService - getAllAnswers', () => {
  let service: AnswersService;

  const mockRepository = {
    getAllAnswers: jest.fn(),
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

  it('should return all answers', async () => {
    const uuid = randomUUID();
    const idUser = randomUUID();
    const answersModel = {
      _data: [
        {
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
        },
      ],
      _meta: {
        _results: 1,
        _total_results: 1,
        _page: 1,
        _total_page: 1,
      },
    };

    mockRepository.getAllAnswers.mockResolvedValue(answersModel);
    const result = await service.getAllAnswers({});

    expect(mockRepository.getAllAnswers).toHaveBeenCalledTimes(1);
    expect(result).toEqual(answersModel);
  });
});
