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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // __UTILS TO VALIDATE THE USER__
  async validateUser(data: LoginUserDto): Promise<User> {
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

    return user;
  }

  // __UTILS TO GENERATE TOKENS__
  async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        { secret: this.configService.get<string>('ACCESS_TOKEN_SECRET') },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  // __LOGIN SERVICE__
  async login(userId: string, email: string) {
    // generate token
    const tokens = await this.generateTokens(userId);

    // hash the rt
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    // save in db and return tokens
    await this.prisma.token.create({
      data: {
        userId,
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return tokens;
  }

  // __REFRESHING THE AT__
  async refresh(userId: string, oldRt: string) {
    // validate the incoming rt from the getRt()
    const validToken = await this.getRt(userId, oldRt);

    // after validation, generate new tokens
    const tokens = await this.generateTokens(userId);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    // updating the previous rt isvalid status, the invalid will be deleted automatically with the cron which we will be implementing later
    await this.prisma.token.update({
      where: {
        id: validToken.id,
      },
      data: {
        isValid: false,
      },
    });

    await this.prisma.token.create({
      data: {
        userId,
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return tokens;
  }

  // __LOGOUT SERVICE__
  async logout(userId: string, rt: string) {
    // we are taking rt because we should invalidate it after the logout
    const validToken = await this.getRt(userId, rt);

    // update the token status
    await this.prisma.token.update({
      where: {
        id: validToken.id,
      },
      data: {
        isValid: false,
      },
    });

    return { message: 'Logged out successfully' };
  }

  // __UTILS FOR GETTING THE RT IN DB (HASHED) FROM PLAIN RT STORED IN COOKIES__
  async getRt(userId: string, rt: string) {
    // fetch all rts of the user
    const rts = await this.prisma.token.findMany({
      where: {
        userId,
        isValid: true,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!rts.length) {
      throw new UnauthorizedException();
    }

    // check if the fetch rts are from the actual user or not
    // we map the fetched rts
    // compare the individual token of the rts with the plain rt from cookies
    // if the rt used is from different user , the promise will fail
    // if the promise is passed, we will get the array like [{isVaid: boolean; token: Token}]
    // we will find that object with the isValid true, note: isValid is not about if it is expired or not, this is true when we compare the hashedtoken in db and previous rt from cookie
    // after finding that object , we just return the token properties of the that object
    // the token will look like , token = {id: string, isValid: boolean, token: string ... and more }
    const validToken = await Promise.all(
      rts.map(async (token) => ({
        isValid: await bcrypt.compare(rt, token.token),
        token,
      })),
    ).then((results) => results.find((res) => res.isValid)?.token);

    if (!validToken) {
      await this.prisma.token.deleteMany({ where: { userId } });
      throw new ForbiddenException(
        'Refresh token reuse detected. All sessions revoked ',
      );
    }

    // return the token
    return validToken;
  }
}
