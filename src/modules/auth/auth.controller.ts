import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';
import { Response } from 'express';
import { AppLogger } from 'modules/logger/logger.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetUser } from 'common/decorators';

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

    return tokens;
  }

  @ApiCookieAuth('refreshToken')
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    console.log(req.cookies);
    const oldToken = req.cookies.refreshToken;
    console.log(req.user);

    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    const tokens = await this.authService.refresh(req.user.sub, oldToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
    });

    return tokens;
  }
}
