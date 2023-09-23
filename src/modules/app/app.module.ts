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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';
import { ProductController } from '../product/product.controller';
import { ProductModel } from '../product/product.model';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', './static'),
    }),
    Config,
    I18n,
    DB,
    UserModel,
    ProductModel,
    UserModule,
    AuthModule,
    EmailModule,
    ProductModule,
  ],
  controllers: [AppController, AuthController, ProductController],
  providers: [AppService, AuthService, UserService, JwtService, ProductService],
})
export class AppModule {}
