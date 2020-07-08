import * as helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// import { configService } from './config/config.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('GESIES')
    .setDescription('GESIES API endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Gesies')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  if (configService.get('MODE') === 'production') {
    app.use(helmet());
    app.enableCors();
  }

  await app.listen(configService.get('PORT'));
}

bootstrap();
