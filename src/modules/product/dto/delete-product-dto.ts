import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/modules/i18n/i18n.generated';

export class DeleteProductDto {
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
}
