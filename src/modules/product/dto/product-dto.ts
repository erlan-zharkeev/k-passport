import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsString,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/modules/i18n/i18n.generated';

export class ProductDto  {
  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotAString', { value: 'Identifier' }),
  })
  @MinLength(1, {
    message: (args: ValidationArguments) => {
      const { constraints } = args;
      const value = constraints[0];
      return i18nValidationMessage<I18nTranslations>(
        'validation.isShort',
        { value: 'Identifier', min: value },
      )(args);
    },
  })
  identifier: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotAString', { value: 'Main image url' }),
  })
  mainImageUrl: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotAString', { value: 'Title' }),
  })
  @MinLength(1, {
    message: (args: ValidationArguments) => {
      const { constraints } = args;
      const value = constraints[0];
      return i18nValidationMessage<I18nTranslations>(
        'validation.isShort',
        { value: 'Title', min: value },
      )(args);
    },
  })
  title: string;

  @ApiProperty()
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotANumber', { value: 'Price' }),
  })
  rubPrice: number;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotAString', { value: 'Description' }),
  })
  description: string

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotAString', { value: 'Category' }),
  })
  category: string

  @ApiProperty()
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotANumber', { value: 'Stock quantity' }),
  })
  inStockQuantity: number
}
