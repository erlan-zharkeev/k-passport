import { BadRequestException, Body, Controller, HttpCode, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CodeTypes } from '../user/@types';
import { ProductDto } from './dto/product-dto';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '../i18n/i18n.generated';
import { ProductService } from './product.service';
import { Product } from './@types';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
enum Paths {
  saveProduct = 'save-product'
}

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly productService: ProductService,
    private readonly authService: AuthService
  ) {}

  @ApiOperation({ summary: 'Save product' })
  @ApiResponse({
    status: 200,
    description: 'Product saved',
  })
  @HttpCode(200)
  // @UseGuards(AuthGuard)
  @Post(Paths.saveProduct)
  async saveProduct(
    @Req() req: Request,
    @Body(new ValidationPipe()) productDto: ProductDto,
  ) {
    const productIdentifier = await this.productService.saveProduct({ product: productDto })
    const { jwt } = req.cookies
    const { sub }  = this.authService.decodeJwt(jwt)

    // const { id, password, code } = passwordDto;
    // const result = await this.userService.checkCodeValidity({
    //   id,
    //   type: CodeTypes.resetPassword,
    //   code,
    // });
    // if (!result) throw new BadRequestException(this.i18n.t('user.codeInvalid'));
    // const hashedPassword = await this.userService.hashPassword({ password });
    // await this.userService.updatePassword({ id, hashedPassword });
    // return { message: this.i18n.t('user.passwordUpdateSuccess') };
  }
}
