import { Test, TestingModule } from '@nestjs/testing';
import { PrismaAnswersRepository } from 'src/infra/database/forum/repositories/answers.repository';
import { PrismaForumService } from 'src/infra/database/forum/prisma.forum.service';
import { randomUUID } from 'crypto';

describe('PrismaAnswersRepository - getVotesByAnswer', () => {
  let repository: PrismaAnswersRepository;

  const mockPrisma = {
    vote: { count: jest.fn() },
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

  it('Should return likes and dislikes count', async () => {
    const idAnswer = randomUUID();

    mockPrisma.vote.count.mockResolvedValueOnce(5).mockResolvedValueOnce(2);

    const result = await repository.getVotesByAnswer(idAnswer);

    expect(mockPrisma.vote.count).toHaveBeenNthCalledWith(1, {
      where: { ID_AN: idAnswer, TYPE: 'LIKE' },
    });
    expect(mockPrisma.vote.count).toHaveBeenNthCalledWith(2, {
      where: { ID_AN: idAnswer, TYPE: 'DESLIKE' },
    });
    expect(result).toEqual({
      ID_AN: idAnswer,
      LIKES: 5,
      DESLIKES: 2,
    });
  });
});
