import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18n } from '../i18n/i18n';
import { AuthModule } from '../auth/auth.module';
import { Config } from '../config/config';
import { DB } from '../db/db';
import { UserModule } from '../user/user.module';
import { AuthController } from '../auth/auth.controller';
import { UserModel } from '../user/user.model';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EmailModule } from '../mailer/email.module';
import { join } from 'path';

@Module({
  imports: [Config, I18n, DB, UserModel, UserModule, AuthModule, EmailModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, UserService, JwtService],
})
export class AppModule {}
