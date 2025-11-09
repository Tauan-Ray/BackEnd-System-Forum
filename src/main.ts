import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger(bootstrap.name);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.set('trust proxy', 'loopback');

  const config = new DocumentBuilder()
    .setTitle('Forum API')
    .setDescription('Documentação da API do fórum')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs/api', app, document);

  await app.listen(process.env.PORT ?? 3000);

  logger.log(`SERVIÇO INICIALIZADO NA PORTA ${process.env.PORT ?? 3000}`);
}
bootstrap();
