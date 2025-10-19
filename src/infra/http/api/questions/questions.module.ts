import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/infra/database/database.module';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [DatabaseModule, JwtModule.register({}), UserModule],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
