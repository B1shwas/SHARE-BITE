import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'database/prisma.service';
import { LoginUserDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from 'modules/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: AppLogger,
  ) {}

  async validateUser(data: LoginUserDto): Promise<User> {
    this.logger.log('Checking user credentials');
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log('User validated');

    return user;
  }

  async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      { secret: this.configService.get<string>('ACCESS_TOKEN_SECRET') },
    );
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );
    return { accessToken, refreshToken };
  }

  async login(userId: string, email: string) {
    this.logger.log('Generating tokens');
    const tokens = await this.generateTokens(userId);

    this.logger.log('Token generated');
    this.logger.log(tokens.accessToken);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    await this.prisma.token.create({
      data: {
        userId,
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return tokens;
  }

  async refresh(userId: string, oldRt: string) {
    const rts = await this.prisma.token.findMany({
      where: {
        userId,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!rts.length) {
      throw new UnauthorizedException();
    }

    const validToken = await Promise.all(
      rts.map(async (token) => ({
        isValid: await bcrypt.compare(oldRt, token.token),
        token,
      })),
    ).then((results) => results.find((res) => res.isValid)?.token);

    if (!validToken) {
      await this.prisma.token.deleteMany({ where: { userId } });
      throw new ForbiddenException(
        'Refresh token reuse detected. All sessions revoked ',
      );
    }

    const tokens = await this.generateTokens(userId);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.prisma.token.create({
      data: {
        userId,
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return tokens;
  }
}
