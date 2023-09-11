import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './@types';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/modules/i18n/i18n.generated';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly ProductModel: Model<Product>,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}
}
