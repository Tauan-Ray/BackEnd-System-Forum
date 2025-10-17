import { Module } from '@nestjs/common';
import { PrismaForumService } from './forum/prisma.forum.service';
import { PrismaUserRepository } from './forum/repositories';
import { PrismaCategoryRespotiory } from './forum/repositories/category.repository';

@Module({
  providers: [PrismaForumService, PrismaUserRepository, PrismaCategoryRespotiory],
  exports: [PrismaUserRepository, PrismaCategoryRespotiory],
})
export class DatabaseModule {}
