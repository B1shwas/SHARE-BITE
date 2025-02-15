import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';
import { Request, Response } from 'express';
import { AppLogger } from 'modules/logger/logger.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetUser } from 'common/decorators';
import { JwtGuard } from './guards/jwt.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {}
  @Post('/login')
  async login(
    @Body() data: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(data);
    const tokens = await this.authService.login(user.id, user.email);

    this.logger.log('Logging');
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return { data: tokens };
  }

  @ApiCookieAuth('refreshToken')
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const oldToken = req.cookies.refreshToken;

    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    const tokens = await this.authService.refresh(req.user.sub, oldToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
    });

    return { data: tokens };
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/logout')
  async logout(
    @Req() req: Request,
    @GetUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rt = req.cookies?.['refreshToken'];

    if (!rt) {
      throw new UnauthorizedException('No RT');
    }

    const message = await this.authService.logout(userId, rt);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });

    return message;
  }
}
