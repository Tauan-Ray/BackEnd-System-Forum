import { Module } from '@nestjs/common';
import { OciService } from './oci.service';
import { OciController } from './oci.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [OciService],
  controllers: [OciController],
  exports: [OciService],
})
export class OciModule {}
