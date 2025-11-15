import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import { OciModule } from './oci/oci.module';

@Module({
  imports: [UserModule, AuthModule, ApiModule, OciModule],
})
export class HttpModule {}
