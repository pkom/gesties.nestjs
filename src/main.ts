import * as helmet from 'helmet';
import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppConfigService } from './config/config.service';
import { AllExceptionsFilter } from './common/shared/filters/exception.filter';
import { TransformInterceptor } from './common/shared/interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './common/shared/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: AppConfigService = app.get(AppConfigService);

  app.setGlobalPrefix('api');

  // app.useGlobalFilters(new AllExceptionsFilter());

  // app.useGlobalInterceptors(new TransformInterceptor());

  const options = new DocumentBuilder()
    .setTitle('GESTIES')
    .setDescription('GESTIES API endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Gesties')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // app.useGlobalGuards(new JwtAuthGuard());

  if (config.isProduction) {
    app.use(helmet());
    app.enableCors();
    app.use(compression());
  }

  await app.listen(config.port);
}

bootstrap();
