import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/modules/i18n/i18n.generated';

export class EmailUserDto {
  @ApiProperty()
  @IsEmail(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>(
        'validation.emailIncorrect',
      ),
    },
  )
  email: string;
}
