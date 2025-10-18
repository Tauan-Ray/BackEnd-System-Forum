import { Module } from '@nestjs/common';
import { PrismaUserRepository, PrismaQuestionsRepository, PrismaCategoryRespotiory } from './forum/repositories/index'
import { PrismaForumService } from './forum/prisma.forum.service';

@Module({
  providers: [PrismaForumService, PrismaUserRepository, PrismaCategoryRespotiory, PrismaQuestionsRepository],
  exports: [PrismaUserRepository, PrismaCategoryRespotiory, PrismaQuestionsRepository],
})
export class DatabaseModule {}
