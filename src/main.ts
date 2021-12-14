import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser'
import * as morgan from 'morgan'

import {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from './configs/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Validation
  app.useGlobalPipes(new ValidationPipe(
    { disableErrorMessages: !!process.env.PRODUCTION }
  ));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  //Cookies
  app.use(cookieParser());

  //Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Pote.dev')
      .setDescription(swaggerConfig.description || 'The Pote.dev API description')
      .setVersion(swaggerConfig.version || '1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  }

  //Cors
  if (corsConfig.enabled) {
    app.enableCors({
      origin: corsConfig.origin,
      credentials: corsConfig.credentials,
    });
  }

  //Logger
  app.use(morgan('combined'))

  await app.listen(process.env.PORT || nestConfig.port || 3000);
  console.log(`Nest APP is running on port : ${process.env.PORT}`)
}
bootstrap();
