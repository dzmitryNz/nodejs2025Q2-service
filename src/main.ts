import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as YAML from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

import { AppModule } from './app.module';
import { RequestInterceptor } from './interceptors/request.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);

  const logger = new Logger();

  app.useLogger(logger);

  const swaggerYaml = fs.readFileSync(
    path.join(__dirname, '../doc/api.yaml'),
    'utf8',
  );
  const swaggerDocument = YAML.parse(swaggerYaml);

  app.useGlobalInterceptors(new RequestInterceptor(logger));

  SwaggerModule.setup('doc', app, swaggerDocument);

  await app.listen(port);
}
bootstrap();
