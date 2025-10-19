import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/infra/database/database.module';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [DatabaseModule, JwtModule.register({}), UserModule],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}
