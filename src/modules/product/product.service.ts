import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './@types';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/modules/i18n/i18n.generated';
import { UpdateProductDto } from './dto/update-product-dto copy';
import { SaveProductDto } from './dto/save-product-dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly ProductModel: Model<Product>,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}
  async saveProduct({ product }: { product: SaveProductDto }): Promise<string> {
    try {
      const candidate = await new this.ProductModel(product).save();
      return candidate.identifier;
    } catch (e) {
      const error = e as any;
      if (error.code === 11000) {
        throw new BadRequestException(
          this.i18n.t('product.productWithTheSameArticleAlreadyExist'),
        );
      } else {
        throw new InternalServerErrorException(
          this.i18n.t('product.failedToSaveProductToDb'),
        );
      }
    }
  }

  async deleteProduct({ id }: { id: string }) {
    try {
      const { deletedCount } = await this.ProductModel.deleteOne({
        identifier: id,
      });
      if (deletedCount) return;
      throw new HttpException(
        this.i18n.t('product.productNotExist'),
        HttpStatus.BAD_REQUEST,
      );
    } catch (e) {
      throw new HttpException(
        this.i18n.t('product.failedToDeleteProduct', {
          args: { reason: e.message },
        }),
        e.status,
      );
    }
  }

  async getAllProductByIds({ ids }: { ids: String[] }) {
    try {
      const products = await this.ProductModel.find({
        identifier: { $in: ids },
      }).select('-_id -__v');
      return products;
    } catch (e) {
      throw new HttpException(
        this.i18n.t('product.failedToGetProducts'),
        e.status,
      );
    }
  }

  async updateProduct({ productData }: { productData: UpdateProductDto }) {
    try {
      const { productId, newIdentifier, ...rest } = productData;
      await this.ProductModel.updateOne(
        { identifier: productId },
        { identifier: newIdentifier, ...rest },
      );
    } catch (e) {
      throw new HttpException(
        this.i18n.t('product.failedToUpdateProduct'),
        e.status,
      );
    }
  }
}
