import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response, Request } from 'express';
import { UserRole } from '../user/@types';
import { AuthService } from './auth.service';

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { jwt, jwtr } = req.cookies;
    const getSecret = (key: string) => this.configService.get<string>(key);
    const checkToken = async (
      token: string,
      secret: string,
      isRefresh: boolean = false,
    ) => {
      try {
        const { name, sub, role } = this.jwtService.verify(token, {
          secret,
        });
        if (role === UserRole.common) throw new UnauthorizedException();
        if (!isRefresh) return next();
        const { accessToken, refreshToken } =
          await this.authService.generateTokenPair({
            username: name,
            id: sub,
            role,
          });
        res.cookie('jwt', accessToken).cookie('jwtr', refreshToken);
        next();
      } catch (e) {
        if (!isRefresh)
          return checkToken(jwtr, getSecret('JWTR_SIGN_SECRET'), true);
        return res.redirect(`auth/admin?from=${req.baseUrl.slice(1)}`);
      }
    };
    checkToken(jwt, getSecret('JWT_SIGN_SECRET'));
  }
}
