import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { DatabaseModule } from 'src/infra/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [DatabaseModule, JwtModule.register({}), UserModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
