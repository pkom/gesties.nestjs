import * as helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { configService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  if (!configService.isProduction()) {
    const options = new DocumentBuilder()
      .setTitle('GESIES')
      .setDescription('GESIES API endpoints')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Gesies')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
  }

  if (configService.isProduction) {
    app.use(helmet());
    app.enableCors();
  }

  await app.listen(configService.getPort());
}

bootstrap();
