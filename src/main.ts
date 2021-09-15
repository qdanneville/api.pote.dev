import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from './configs/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Validation
  app.useGlobalPipes(new ValidationPipe(
    {disableErrorMessages: !!process.env.PRODUCTION}
  ));

  // Prisma Client Exception Filter for unhandled exceptions
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  // const corsConfig = configService.get<CorsConfig>('cors');
  // const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Cors
  // if (corsConfig.enabled) {
  //   app.enableCors();
  // }

  await app.listen(process.env.PORT || nestConfig.port || 3000);
  console.log(`Nest APP is running on port : ${process.env.PORT}`)
}
bootstrap();
