import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(bootstrap.name);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }))
  await app.listen(process.env.PORT ?? 3000);

  logger.log(`SERVIÇO INICIALIZADO NA PORTA ${process.env.PORT ?? 3000}`)
}
bootstrap();
