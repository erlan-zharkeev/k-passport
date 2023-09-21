import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { UserModel } from '../user/user.model';

@Module({
  imports: [UserModel, ProductModel],
  controllers: [ProductController],
  providers: [UserService, AuthService, ProductService, JwtService],
})
export class ProductModule {}
