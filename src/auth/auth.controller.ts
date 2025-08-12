import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ApiCookieAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { MyApiResponse } from './decorators/my-api-response.decorator';
import { authApiResponse, userApiResponse } from '../../api-responses';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  @UseGuards(ThrottlerGuard)
  @MyApiResponse(authApiResponse)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @MyApiResponse(authApiResponse)
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.register(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @ApiCookieAuth('refreshToken')
  @MyApiResponse(authApiResponse)
  @ApiHeader({name: 'authorization', required: true, description: 'Bearer token'})
  @HttpCode(200)
  @Post('login/access-token')
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshTokenFromCookies =
      req.cookies[this.authService.REFRESH_TOKEN_NAME]

    console.log({ refreshTokenFromCookies })

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenFromResponse(res)
      throw new UnauthorizedException('Refresh token not found')
    }

    const { refreshToken, ...response } =
      await this.authService.getNewTokens(refreshTokenFromCookies)

    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  
  @MyApiResponse(true)
  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res);
    return true;
  }

  @ApiResponse({ status: 301, description: 'Redirect to Google OAuth' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.validateOAuthLogin(req);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    const isTestMode = this.configService.get('IS_TEST_MODE') === 'true';

    if (isTestMode) {
      return response;
    }
    res.redirect(`${this.configService.get('CLIENT_URL')}/dashboard?access_token=${response.accessToken}`);
  }
  @ApiResponse({ status: 301, description: 'Redirect to Yandex OAuth' })
  @Get('yandex')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuth() { }

  @Get('yandex/callback')
  @UseGuards(AuthGuard('yandex'))
  async yandexCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.validateOAuthLogin(req);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    const isTestMode = this.configService.get('IS_TEST_MODE') === 'true';

    if (isTestMode) {
      return response;
    }
    res.redirect(`${this.configService.get('CLIENT_URL')}/dashboard?access_token=${response.accessToken}`);
  }

}
