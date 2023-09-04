import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserModel } from './user.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModel],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
