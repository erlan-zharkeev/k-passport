import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/modules/i18n/i18n.generated';

export class UpdateProductDto {
  @ApiProperty()
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.notEmpty', {
      value: 'Product id',
    }),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.isNotAString',
      { value: 'Product id' },
    ),
  })
  productId: string;

  @ApiProperty()
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.notEmpty', {
      value: 'New product id',
    }),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.isNotAString',
      { value: 'New product id' },
    ),
  })
  @IsOptional()
  newIdentifier?: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.isNotAString',
      { value: 'Title' },
    ),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.notEmpty', {
      value: 'Title',
    }),
  })
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.isNotANumber',
      { value: 'Price' },
    ),
  })
  @IsOptional()
  rubPrice?: number;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.isNotAString',
      { value: 'Description' },
    ),
  })
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.isNotAString',
      { value: 'Category' },
    ),
  })
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.isNotANumber',
      { value: 'Stock quantity' },
    ),
  })
  @IsOptional()
  inStockQuantity?: number;
}
