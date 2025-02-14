import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const refreshToken = request?.cookies?.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) {
      return false;
    }

    try {
      const secret = this.configService.get<string>('REFRESH_TOKEN_SECRET');
      const decoded = this.jwtService.verify(refreshToken, { secret });
      console.log(secret, decoded);

      request['user'] = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
