import { Module } from '@nestjs/common';
import { PrismaForumService } from './forum/prisma.forum.service';
import { PrismaUserRepository } from './forum/repositories';

@Module({
  providers: [PrismaForumService, PrismaUserRepository],
  exports: [PrismaUserRepository],
})
export class DatabaseModule {}
