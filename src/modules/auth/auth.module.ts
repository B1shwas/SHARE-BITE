import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'database/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from 'modules/logger/logger.service';

import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({ global: true }),
    PassportModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, ConfigService, AppLogger, JwtStrategy],
  exports: [],
})
export class AuthModule {}
