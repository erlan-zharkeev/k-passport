import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserModel } from './user.model';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { AppService } from '../app/app.service';

@Module({
  imports: [UserModel],
  controllers: [UserController],
  providers: [UserService, JwtService, AuthService, AppService],
})
export class UserModule {}
