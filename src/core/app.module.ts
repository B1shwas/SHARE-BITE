import { UserModule } from '../modules/user/user.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonModule } from 'common/common.module';
import { HttpLoggerMiddleware } from 'common/middlewares';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  imports: [UserModule, CommonModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
