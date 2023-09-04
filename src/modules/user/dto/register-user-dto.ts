import { Length, Matches, ValidationArguments } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/modules/i18n/i18n.generated';
import { LoginUserDto } from './login-user-dto';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto extends LoginUserDto {
  @ApiProperty()
  @Matches(/^[^\s@#$%^&*!.]*$/, {
    message: i18nValidationMessage<I18nTranslations>(
      'validation.usernameMustNotConsistSigns',
    ),
  })
  @Length(1, 20, {
    message: (args: ValidationArguments) => {
      const { constraints } = args;
      const min = constraints[0];
      const max = constraints[1];
      return i18nValidationMessage<I18nTranslations>(
        'validation.usernameLengthOutOfRange',
        { min, max },
      )(args);
    },
  })
  username: string;
}
