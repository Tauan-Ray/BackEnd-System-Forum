import { Module } from '@nestjs/common';
import { InfraModule } from './infra/infra.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerConfigGuard } from './common/guards/throttler-config.guard';

@Module({
  imports: [InfraModule, ThrottlerModule.forRoot([{ ttl: 60000, limit: 30, blockDuration: 5000 }])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerConfigGuard,
    },
  ],
})
export class AppModule {}
