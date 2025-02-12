import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from 'modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
