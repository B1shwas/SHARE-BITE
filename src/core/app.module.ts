import { AuthModule } from './../modules/auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonModule } from 'common/common.module';
import { HttpLoggerMiddleware } from 'common/middlewares';

@Module({
  imports: [AuthModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
