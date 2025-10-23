import { Module } from '@nestjs/common';
import {
  PrismaUserRepository,
  PrismaQuestionsRepository,
  PrismaCategoryRespository,
  PrismaAnswersRepository,
} from './forum/repositories/index';
import { PrismaForumService } from './forum/prisma.forum.service';

@Module({
  providers: [
    PrismaForumService,
    PrismaUserRepository,
    PrismaCategoryRespository,
    PrismaQuestionsRepository,
    PrismaAnswersRepository,
  ],
  exports: [
    PrismaUserRepository,
    PrismaCategoryRespository,
    PrismaQuestionsRepository,
    PrismaAnswersRepository,
  ],
})
export class DatabaseModule {}
