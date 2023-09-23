import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PossibleUserSearchProperty, UserRole } from '../user/@types';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dto/login-user-dto';
import * as bcrypt from 'bcryptjs';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '../i18n/i18n.generated';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly configService: ConfigService,
  ) {}

  async validateUserPassword(loginData: LoginUserDto) {
    const { email, password } = loginData;
    const user = await this.userService.getUserByProperty({
      property: PossibleUserSearchProperty.email,
      value: email,
    });
    if (!user) {
      throw new NotFoundException(this.i18n.t('user.notFound'));
    }
    if (!user.confirmed) {
      throw new UnauthorizedException(this.i18n.t('user.emailNotConfirmed'));
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (isPasswordValid) {
      delete user.password;
      return user;
    }
    throw new UnauthorizedException(this.i18n.t('auth.invalidPassword'));
  }

  async generateTokenPair(userData: {
    username: string;
    id: string;
    role: UserRole;
  }) {
    const refreshToken = this.generateToken({
      ...userData,
      isRefresh: true,
    });
    await this.saveRefreshToken({ id: userData.id, refreshToken });
    return {
      accessToken: this.generateToken(userData),
      refreshToken,
    };
  }

  generateToken({
    username,
    id,
    isRefresh = false,
    role,
  }: {
    username: string;
    id: string;
    isRefresh?: boolean;
    role: UserRole;
  }) {
    const payload = { name: username, sub: id, role };
    const secretKey = isRefresh ? 'JWTR_SIGN_SECRET' : 'JWT_SIGN_SECRET';
    const secret = this.configService.get<string>(secretKey);
    const expiresInKey = isRefresh ? 'JWTR_EXPIRES_IN' : 'JWT_EXPIRES_IN';
    const expiresIn = this.configService.get<string>(expiresInKey);
    const options = {
      secret,
      expiresIn,
    };
    return this.jwtService.sign(payload, options);
  }

  async saveRefreshToken({
    id,
    refreshToken,
  }: {
    id: string;
    refreshToken: string;
  }) {
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.userService.updateRefreshToken({
      id,
      token: hashedRefreshToken,
    });
  }
}
