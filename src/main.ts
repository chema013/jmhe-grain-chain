import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const globalPrefix = configService.get('GLOBAL_PREFIX');

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('GrainChain API')
    .setDescription('GrainChain API reference')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  const port = configService.get('PORT')
  await app.listen(port);
}
bootstrap();
