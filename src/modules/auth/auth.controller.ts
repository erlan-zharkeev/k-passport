import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Res,
  Get,
  Render,
  HttpCode,
} from '@nestjs/common';
import { LoginUserDto } from '../user/dto/login-user-dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '../i18n/i18n.generated';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from '../user/dto/user-dto';

enum Paths {
  admin = 'admin',
  login = 'login',
}

export const AuthEndpoints = {
  admin: `auth/${Paths.admin}`,
  login: `auth/${Paths.login}`,
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  @Get(Paths.admin)
  @ApiExcludeEndpoint()
  @Render('auth/index')
  root() {}

  @ApiOperation({ summary: 'User login' })
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Login success', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post(Paths.login)
  @ApiBody({ type: LoginUserDto })
  async login(
    @Res({ passthrough: true })
    response: Response,
    @Body(new ValidationPipe()) loginData: LoginUserDto,
  ) {
    const userData = await this.authService.validateUserPassword(loginData);
    const { accessToken, refreshToken } =
      await this.authService.generateTokenPair({
        username: userData.username,
        id: userData.id,
        role: userData.role,
      });
    const successData = {
      message: this.i18n.t('auth.loginSuccess'),
      data: userData,
    };
    return response
      .cookie('jwt', accessToken)
      .cookie('jwtr', refreshToken)
      .json(successData);
  }
}
