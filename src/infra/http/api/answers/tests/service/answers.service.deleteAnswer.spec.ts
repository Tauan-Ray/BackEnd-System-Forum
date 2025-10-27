import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaAnswersRepository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { AnswersService } from '../../answers.service';
import { randomUUID } from 'crypto';
import { generateUpdatedPayload } from 'src/infra/http/user/tests/util/GeneratorUser.util';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

describe('AnswersService - deleteAnswer', () => {
  let service: AnswersService;

  const mockRepository = {
    deleteAnswer: jest.fn(),
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
    const idAnswer = randomUUID();

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });
    const getAnswerById = jest.spyOn(service, 'getAnswerById');
    getAnswerById.mockRejectedValueOnce(new NotFoundException('Resposta não encontrada'));

    try {
      await service.deleteAnswer(loggedUser, idAnswer);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Resposta não encontrada');
    }

    expect(getAnswerById).toHaveBeenCalledTimes(1);
    expect(getAnswerById).toHaveBeenCalledWith(idAnswer);
  });

  it('should throw UnauthorizedException if not is the same user', async () => {
    const uuid = randomUUID();
    const idAnswer = randomUUID();

    const answerModel = {
      ID_AN: idAnswer,
      ID_USER: randomUUID(),
      ID_QT: randomUUID(),
      RESPONSE: 'Pesquisa',
      VOTES: [],
      DT_CR: new Date(),
      DEL_AT: null,
      User: {
        USERNAME: 'Tauan',
        ROLE: UserRole.ADMIN,
      },
      Question: {
        TITLE: 'Como criar um projeto nest js?',
        Category: {
          CATEGORY: 'Desenvolvimento',
        },
      },
    };

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: 'malu',
      email: 'malu@example.com',
      role: 'USER',
    });
    const getAnswerById = jest.spyOn(service, 'getAnswerById');
    getAnswerById.mockResolvedValue(answerModel);

    try {
      await service.deleteAnswer(loggedUser, idAnswer);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Você não pode deletar a respostas de um outro usuário');
    }

    expect(getAnswerById).toHaveBeenCalledTimes(1);
    expect(getAnswerById).toHaveBeenCalledWith(idAnswer);
  });

  it('should delete a answer with correct data', async () => {
    const uuid = randomUUID();
    const idAnswer = randomUUID();

    const answerModel = {
      ID_AN: idAnswer,
      ID_USER: uuid,
      ID_QT: randomUUID(),
      RESPONSE: 'Pesquisa',
      VOTES: [],
      DT_CR: new Date(),
      DEL_AT: null,
      User: {
        USERNAME: 'malu',
        ROLE: UserRole.USER,
      },
      Question: {
        TITLE: 'Como criar um projeto nest js?',
        Category: {
          CATEGORY: 'Desenvolvimento',
        },
      },
    };

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: 'malu',
      email: 'malu@example.com',
      role: 'USER',
    });
    const getAnswerById = jest.spyOn(service, 'getAnswerById');
    getAnswerById.mockResolvedValue(answerModel);

    const result = await service.deleteAnswer(loggedUser, idAnswer);

    expect(getAnswerById).toHaveBeenCalledTimes(1);
    expect(getAnswerById).toHaveBeenCalledWith(idAnswer);
    expect(mockRepository.deleteAnswer).toHaveBeenCalledTimes(1);
    expect(mockRepository.deleteAnswer).toHaveBeenCalledWith(idAnswer);

    expect(result).toEqual({ message: 'Resposta deletada com sucesso' });
  });

  it('should update a question if user logged is ADMIN', async () => {
    const uuid = randomUUID();
    const idAnswer = randomUUID();

    const answerModel = {
      ID_AN: idAnswer,
      ID_USER: uuid,
      ID_QT: randomUUID(),
      RESPONSE: 'Pesquisa',
      VOTES: [],
      DT_CR: new Date(),
      DEL_AT: null,
      User: {
        USERNAME: 'malu',
        ROLE: UserRole.USER,
      },
      Question: {
        TITLE: 'Como criar um projeto nest js?',
        Category: {
          CATEGORY: 'Desenvolvimento',
        },
      },
    };

    const loggedUser = generateUpdatedPayload({
      sub: randomUUID(),
      username: 'tauan',
      email: 'tauan@example.com',
      role: 'ADMIN',
    });
    const getAnswerById = jest.spyOn(service, 'getAnswerById');
    getAnswerById.mockResolvedValue(answerModel);

    const result = await service.deleteAnswer(loggedUser, idAnswer);

    expect(getAnswerById).toHaveBeenCalledTimes(1);
    expect(getAnswerById).toHaveBeenCalledWith(idAnswer);
    expect(mockRepository.deleteAnswer).toHaveBeenCalledTimes(1);
    expect(mockRepository.deleteAnswer).toHaveBeenCalledWith(idAnswer);

    expect(result).toEqual({ message: 'Resposta deletada com sucesso' });
  });
});
