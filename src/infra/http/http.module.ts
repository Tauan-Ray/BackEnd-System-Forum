import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [UserModule, AuthModule, ApiModule]
})
export class HttpModule { }
