import { PrismaService } from './prisma.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService],
})
export class PrismaModule {}
