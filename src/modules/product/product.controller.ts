import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SaveProductDto } from './dto/save-product-dto';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '../i18n/i18n.generated';
import { ProductService } from './product.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { DeleteProductDto } from './dto/delete-product-dto';
import { UpdateProductDto } from './dto/update-product-dto copy';
import { JWTAuthGuardRequest } from '../user/@types';

enum Paths {
  saveProduct = 'save-product',
  deleteProduct = 'delete-product',
  getAllProduct = 'get-all-product',
  updateProduct = 'update-product',
}

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly productService: ProductService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Save product' })
  @ApiResponse({
    status: 200,
    description: 'Product saved',
  })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Post(Paths.saveProduct)
  async saveProduct(
    @Req() req: JWTAuthGuardRequest,
    @Body(new ValidationPipe()) productDto: SaveProductDto,
  ) {
    const productId = await this.productService.saveProduct({
      product: productDto,
    });
    const { sub } = req.user;
    if (!productId || !sub) {
      throw new HttpException(
        this.i18n.t('product.productIdOrTokenNotProvided'),
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userService.saveProductId({ userId: sub, productId });
    return { message: this.i18n.t('product.productSavedSuccess') };
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted',
  })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Delete(Paths.deleteProduct)
  async deleteProduct(
    @Req() req: JWTAuthGuardRequest,
    @Body(new ValidationPipe()) productDto: DeleteProductDto,
  ) {
    const { productId } = productDto;
    const { sub } = req.user;
    await this.userService.deleteProductIdFromUser({ userId: sub, productId });
    await this.productService.deleteProduct({ id: productId });
    return { message: this.i18n.t('product.productDeletedSuccess') };
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Products are sent success',
  })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get(Paths.getAllProduct)
  async getAllProduct(@Req() req: JWTAuthGuardRequest) {
    const { sub } = req.user;
    const productIds = await this.userService.getAllProductIds({ userId: sub });
    return await this.productService.getAllProductByIds({ ids: productIds });
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({
    status: 200,
    description: 'Product updated',
  })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Patch(Paths.updateProduct)
  async updateProduct(
    @Req() req: JWTAuthGuardRequest,
    @Body(new ValidationPipe()) productDto: UpdateProductDto,
  ) {
    const { sub } = req.user;
    await this.productService.updateProduct({ productData: productDto });
    await this.userService.updateProductIdInUserProductList({
      userId: sub,
      productId: productDto.productId,
      newProductId: productDto.newIdentifier,
    });
    return { message: this.i18n.t('product.productUpdatedSuccessfully') };
  }
}
