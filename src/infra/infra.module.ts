import { Module } from '@nestjs/common';
import { EncryptionModule } from './encryption/encryption.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [EncryptionModule, HttpModule],
})
export class InfraModule {}
