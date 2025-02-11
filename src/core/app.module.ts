import { AuthModule } from './../modules/auth/auth.module';
import { AuthService } from './../modules/auth/auth.service';
import { AuthController } from './../modules/auth/auth.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
