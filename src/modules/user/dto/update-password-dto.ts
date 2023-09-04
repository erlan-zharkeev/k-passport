import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  Matches,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/modules/i18n/i18n.generated';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotAString'),
  })
  @Length(1, 20, {
    message: (args: ValidationArguments) => {
      const { constraints } = args;
      const min = constraints[0];
      const max = constraints[1];
      return i18nValidationMessage<I18nTranslations>(
        'validation.passwordLengthOutOfRange',
        { min, max },
      )(args);
    },
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: i18nValidationMessage<I18nTranslations>(
      'validation.passwordNotMatchRegexp',
    ),
  })
  password: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotAString'),
  })
  @MinLength(10, {
    message: (args: ValidationArguments) => {
      const { constraints } = args;
      const min = constraints[0];
      return i18nValidationMessage<I18nTranslations>(
        'validation.passwordLengthOutOfRange',
        { min },
      )(args);
    },
  })
  id: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotAString'),
  })
  @MinLength(4, {
    message: (args: ValidationArguments) => {
      const { constraints } = args;
      const min = constraints[0];
      return i18nValidationMessage<I18nTranslations>('validation.codeIsShort', {
        min,
      })(args);
    },
  })
  code: string;
}
