import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const NODE_ENV = configService.get<string>('nodeEnv');
  app.useGlobalPipes(new ValidationPipe());

  if (NODE_ENV === 'development')
    app.enableCors();

  const port = configService.get<number>('port');
  await app.listen(port);
  logger.log(`Application listening on port ${port}!`);
}
bootstrap();
