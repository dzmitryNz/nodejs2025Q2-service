import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

import { AppModule } from './app.module';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { ExceptionsFilter } from './filters/exceptions-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);

  const logger = new Logger();

  app.useLogger(logger);

  const swaggerYaml = fs.readFileSync(
    path.join(__dirname, '..', '..', 'doc/api.yaml'),
    'utf8',
  );
  const swaggerDocument = YAML.parse(swaggerYaml);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new RequestInterceptor(logger));
  app.useGlobalFilters(new ExceptionsFilter(logger));

  SwaggerModule.setup('doc', app, swaggerDocument);

  logger.log({
    PORT: process?.env?.PORT,
    CRYPT_SALT: process?.env?.CRYPT_SALT?.length,
    JWT_SECRET_KEY: process?.env?.JWT_SECRET_KEY?.length,
    JWT_SECRET_REFRESH_KEY: process?.env?.JWT_SECRET_REFRESH_KEY?.length,
    TOKEN_EXPIRE_TIME: process?.env?.TOKEN_EXPIRE_TIME,
    TOKEN_REFRESH_EXPIRE_TIME: process?.env?.TOKEN_REFRESH_EXPIRE_TIME,
    POSTGRES_USER: process?.env?.POSTGRES_USER,
    POSTGRES_PASSWORD: process?.env?.POSTGRES_PASSWORD?.length,
    POSTGRES_DB: process?.env?.POSTGRES_DB,
    POSTGRES_HOST: process?.env?.POSTGRES_HOST,
    POSTGRES_PORT: process?.env?.POSTGRES_PORT,
    NODE_ENV: process?.env?.NODE_ENV,
  });

  await app.listen(port);
}
bootstrap();
