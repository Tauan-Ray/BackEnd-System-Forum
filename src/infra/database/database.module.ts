import { Module } from '@nestjs/common';
import {
  PrismaUserRepository,
  PrismaQuestionsRepository,
  PrismaCategoryRespotiory,
  PrismaAnswersRepository,
} from './forum/repositories/index';
import { PrismaForumService } from './forum/prisma.forum.service';

@Module({
  providers: [
    PrismaForumService,
    PrismaUserRepository,
    PrismaCategoryRespotiory,
    PrismaQuestionsRepository,
    PrismaAnswersRepository,
  ],
  exports: [
    PrismaUserRepository,
    PrismaCategoryRespotiory,
    PrismaQuestionsRepository,
    PrismaAnswersRepository,
  ],
})
export class DatabaseModule {}
