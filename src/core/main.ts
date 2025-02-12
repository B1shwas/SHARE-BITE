import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from 'modules/logger/logger.service';
import { HttpExceptionFilter } from 'common/filters';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  });
  app.useGlobalFilters(new HttpExceptionFilter());

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
