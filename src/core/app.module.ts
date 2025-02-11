import { ConfigModule } from 'config';
import { PrismaModule } from './../database/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
