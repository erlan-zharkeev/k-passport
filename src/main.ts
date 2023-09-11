import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import * as cookieParser from 'cookie-parser';
import { corsConfig, swaggerConfig } from './modules/config/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AdminAuthMiddleware } from './modules/auth/admin.auth.middleware';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);
  app.enableCors(corsConfig(configService));
  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(new I18nValidationExceptionFilter());
  app.use(cookieParser());
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const authService = app.get(AuthService);
  const jwtService = app.get(JwtService);
  app.use('/api', (req: Request, res: Response, next: NextFunction) =>
    new AdminAuthMiddleware(authService, configService, jwtService).use(
      req,
      res,
      next,
    ),
  );
  SwaggerModule.setup('api', app, document);
  const port = Number(configService.get<string>('SERVER_PORT'));
  await app.listen(port);
}

bootstrap();
