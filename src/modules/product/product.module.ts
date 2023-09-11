import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Module({
  imports: [ProductModel],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
