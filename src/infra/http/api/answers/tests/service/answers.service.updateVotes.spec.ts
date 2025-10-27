import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaAnswersRepository,
  PrismaQuestionsRepository,
  PrismaUserRepository,
} from 'src/infra/database/forum/repositories';
import { AnswersService } from '../../answers.service';
import { randomUUID } from 'crypto';
import { generateUpdatedPayload } from 'src/infra/http/user/tests/util/GeneratorUser.util';
import { NotFoundException } from '@nestjs/common';
import { TypeVotes, UserRole } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UpdateVoteDto } from '../../dto';

describe('AnswersService - updateVotes', () => {
  let service: AnswersService;

  const mockRepository = {
    updateVotes: jest.fn(),
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
    const dto = plainToInstance(UpdateVoteDto, { type: TypeVotes.LIKE });

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });
    const getAnswerById = jest.spyOn(service, 'getAnswerById');
    getAnswerById.mockRejectedValueOnce(new NotFoundException('Resposta não encontrada'));

    try {
      await service.updateVotes(loggedUser, idAnswer, dto);
      throw new Error('error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Resposta não encontrada');
    }

    expect(getAnswerById).toHaveBeenCalledTimes(1);
    expect(getAnswerById).toHaveBeenCalledWith(idAnswer);
  });

  it('should update vote successfully if data is valid', async () => {
    const uuid = randomUUID();
    const idAnswer = randomUUID();
    const dto = plainToInstance(UpdateVoteDto, { type: TypeVotes.LIKE });

    const updatedVote = { message: 'Voto criado' };

    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });

    const answerByIdModel = {
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

    const getAnswerById = jest.spyOn(service, 'getAnswerById');
    getAnswerById.mockResolvedValue(answerByIdModel);
    mockRepository.updateVotes.mockResolvedValue(updatedVote);

    const result = await service.updateVotes(loggedUser, idAnswer, dto);

    expect(mockRepository.updateVotes).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateVotes).toHaveBeenCalledWith(loggedUser.sub, idAnswer, dto.type);
    expect(getAnswerById).toHaveBeenCalledTimes(1);
    expect(getAnswerById).toHaveBeenCalledWith(idAnswer);

    expect(result).toEqual(updatedVote);
  });
});
