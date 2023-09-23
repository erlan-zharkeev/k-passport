import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/modules/i18n/i18n.generated';

export class SaveProductDto {
  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.isNotAString',
      { value: 'Identifier' },
    ),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.notEmpty', {
      value: 'Identifier',
    }),
  })
  identifier: string;

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
  title: string;

  @ApiProperty()
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.isNotANumber',
      { value: 'Price' },
    ),
  })
  rubPrice: number;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.isNotAString',
      { value: 'Description' },
    ),
  })
  description: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.isNotAString',
      { value: 'Category' },
    ),
  })
  category: string;

  @ApiProperty()
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.isNotANumber',
      { value: 'Stock quantity' },
    ),
  })
  inStockQuantity: number;
}
