import * as helmet from 'helmet';
import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppConfigService } from './config/config.service';
import { ValidationPipe, Logger } from '@nestjs/common';
// import { TransformInterceptor } from './common/shared/interceptors/transform.interceptor';
// import { AllExceptionsFilter } from './common/shared/filters/exception.filter';
// import { JwtAuthGuard } from './common/shared/guards/jwt-auth.guard';

async function bootstrap() {
  const logger = new Logger('NestApplication');

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config: AppConfigService = app.get(AppConfigService);

  app.setGlobalPrefix('api');

  // app.useGlobalFilters(new AllExceptionsFilter());
  // app.useGlobalInterceptors(new TransformInterceptor());
  // app.useGlobalGuards(new JwtAuthGuard());

  const options = new DocumentBuilder()
    .setTitle('GestIES')
    .setDescription('GestIES API endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Gesties')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  if (config.isProduction) {
    logger.log('Application running in production mode');
    app.use(helmet());
    app.enableCors();
    app.use(compression());
  }

  await app.listen(config.port);
  logger.log(`Application running on port ${config.port}`);
}

bootstrap();
