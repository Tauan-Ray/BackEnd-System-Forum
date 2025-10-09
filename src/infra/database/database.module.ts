import { Module } from '@nestjs/common';
import { PrismaForumService } from './forum/prisma.forum.service';

@Module({
  providers: [PrismaForumService],
  exports: [],
})
export class DatabaseModule {}
