import { Test, TestingModule } from '@nestjs/testing';
import { PrismaAnswersRepository } from 'src/infra/database/forum/repositories/answers.repository';
import { PrismaForumService } from 'src/infra/database/forum/prisma.forum.service';
import { TypeVotes } from 'src/infra/http/api/answers/dto/update-vote.dto';
import { randomUUID } from 'crypto';

describe('PrismaAnswersRepository - updateVotes', () => {
  let repository: PrismaAnswersRepository;

  const mockPrisma = {
    vote: {
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaAnswersRepository, { provide: PrismaForumService, useValue: mockPrisma }],
    }).compile();

    repository = module.get<PrismaAnswersRepository>(PrismaAnswersRepository);
  });

  beforeEach(() => jest.resetAllMocks());

  it('Should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('Should remove vote if same type already exists', async () => {
    const idUser = randomUUID();
    const idAnswer = randomUUID();

    mockPrisma.vote.findUnique.mockResolvedValueOnce({ TYPE: TypeVotes.like });

    const result = await repository.updateVotes(idUser, idAnswer, TypeVotes.like);

    expect(mockPrisma.vote.delete).toHaveBeenCalledWith({
      where: { ID_USER_ID_AN: { ID_USER: idUser, ID_AN: idAnswer } },
    });
    expect(result).toEqual({ message: 'Voto removido' });
  });

  it('Should update vote if exists with different type', async () => {
    const idUser = randomUUID();
    const idAnswer = randomUUID();

    mockPrisma.vote.findUnique.mockResolvedValueOnce({ TYPE: TypeVotes.deslike });

    const result = await repository.updateVotes(idUser, idAnswer, TypeVotes.like);

    expect(mockPrisma.vote.update).toHaveBeenCalledWith({
      where: { ID_USER_ID_AN: { ID_USER: idUser, ID_AN: idAnswer } },
      data: { TYPE: TypeVotes.like },
    });
    expect(result).toEqual({ message: 'Voto atualizado' });
  });

  it('Should create vote if not exists', async () => {
    const idUser = randomUUID();
    const idAnswer = randomUUID();

    mockPrisma.vote.findUnique.mockResolvedValueOnce(null);

    const result = await repository.updateVotes(idUser, idAnswer, TypeVotes.deslike);

    expect(mockPrisma.vote.create).toHaveBeenCalledWith({
      data: { ID_USER: idUser, ID_AN: idAnswer, TYPE: TypeVotes.deslike },
    });
    expect(result).toEqual({ message: 'Voto criado' });
  });
});
