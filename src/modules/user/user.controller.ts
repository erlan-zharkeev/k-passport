import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  Req,
  NotFoundException,
  Query,
  Render,
  BadRequestException,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user-dto';
import {
  CodeTypes,
  JWTAuthGuardRequest,
  PossibleUserSearchProperty,
} from './@types';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user-dto';
import { AuthGuard } from './../auth/auth.guard';
import { MailerService } from '@nestjs-modules/mailer';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '../i18n/i18n.generated';
import { Request } from 'express';
import { packageVariables } from '../config/config';
import { EmailUserDto } from './dto/email-user-dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { ConfigService } from '@nestjs/config';
import { AppService } from '../app/app.service';

enum Params {
  id = 'id',
  resetPassCode = 'reset-password-code',
}

enum Paths {
  data = 'data',
  register = 'register',
  emailConfirmation = 'email-confirmation',
  sendLinkToPasswordReset = 'send-link-to-password-reset',
  passwordResetPage = 'password-reset',
  updatePassword = 'update-password',
}

export const UserEndpoints = {
  getData: `user/${Paths.data}`,
  register: `user/${Paths.register}`,
  emailConfirmation: `user/${Paths.emailConfirmation}`,
  sendLinkToPasswordReset: `user/${Paths.sendLinkToPasswordReset}`,
  passwordResetPage: `user/${Paths.passwordResetPage}`,
  updatePassword: `user/${Paths.updatePassword}`,
};

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly configService: ConfigService,
    private readonly appService: AppService,
  ) {
    this.userService.loadFixtures();
  }

  // @Get(Paths.passwordResetPage)
  // @ApiExcludeEndpoint()
  // @Render('password-reset/index')
  // root() {}

  @Get(Paths.emailConfirmation)
  @ApiExcludeEndpoint()
  @Render('email-confirmed/index')
  async getEmailConfirmed(@Query(Params.id) id: string) {
    if (!id) throw new NotFoundException(this.i18n.t('user.notFound'));
    await this.userService.markUserEmailConfirmed({ id });
    const redirectTo = this.configService.get<string>('FRONTEND_HOST');
    return { redirectTo };
  }

  @ApiOperation({ summary: 'Send link to reset password' })
  @ApiResponse({
    status: 200,
    description: 'Password reset link successfully sent',
  })
  @HttpCode(200)
  @Post(Paths.sendLinkToPasswordReset)
  async passwordReset(
    @Body(new ValidationPipe()) emailUserDto: EmailUserDto,
    @Req() req: Request,
  ) {
    const { email } = emailUserDto;
    const { reasons, id } = await this.userService.isUserExist({
      email,
    });
    if (!reasons.length) {
      throw new NotFoundException(this.i18n.t('user.notFound'));
    }

    const code = uuidv4();

    const [_, existCodeTimeStamp] = await this.userService.getCode({
      id,
      type: CodeTypes.resetPassword,
    });

    if (existCodeTimeStamp) {
      const maxIntervalInMinutes = Number(
        this.configService.get<string>('CODES_RESEND_INTERVAL_IN_MINUTES'),
      );

      const timeDifferenceInMinutes =
        (Number(Date.now()) - Number(existCodeTimeStamp)) / (1000 * 60);

      if (timeDifferenceInMinutes < maxIntervalInMinutes) {
        throw new BadRequestException(this.i18n.t('user.codeCantBeSend'));
      }
    }

    await this.userService.updateCode({
      code,
      id,
      type: CodeTypes.resetPassword,
    });
    const host = this.configService.get<string>('FRONTEND_HOST');

    const link = `http://${host}/reset-password?${Params.id}=${id}&${Params.resetPassCode}=${code}`;
    const logoLink = this.appService.getStaticImageByName({ name: 'logo.jpg' });

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: this.i18n.t('user.resetPassword'),
        template: './reset-password',
        context: {
          link,
          logoLink,
          appName: packageVariables.name,
          currentYear: new Date().getFullYear(),
        },
      });
      return { message: this.i18n.t('user.linkToResetPasswordSent') };
    } catch {
      throw this.i18n.t('user.failedToSaveCode');
    }
  }

  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({
    status: 200,
    description: 'Password updated',
  })
  @HttpCode(200)
  @Post(Paths.updatePassword)
  async updatePassword(
    @Body(new ValidationPipe()) passwordDto: UpdatePasswordDto,
  ) {
    const { id, password, code } = passwordDto;
    const result = await this.userService.checkCodeValidity({
      id,
      type: CodeTypes.resetPassword,
      code,
    });
    if (!result) throw new BadRequestException(this.i18n.t('user.codeInvalid'));
    const hashedPassword = await this.userService.hashPassword({ password });
    await this.userService.updatePassword({ id, hashedPassword });
    return { message: this.i18n.t('user.passwordUpdateSuccess') };
  }

  @ApiOperation({ summary: 'Get user data' })
  @ApiResponse({
    status: 200,
    description: 'User data has been sent successfully',
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get(Paths.data)
  async getData(@Req() req: JWTAuthGuardRequest) {
    const userId = req.user.sub;
    const user = await this.userService.getUserByProperty({
      property: PossibleUserSearchProperty.id,
      value: userId,
      filters: ['password'],
    });
    return user;
  }

  @ApiOperation({ summary: 'User register' })
  @ApiResponse({
    status: 201,
    description: 'User created',
  })
  @ApiBody({ type: RegisterUserDto })
  @Post(Paths.register)
  async register(
    @Body(new ValidationPipe()) registerUserDto: RegisterUserDto,
    @Req() req: Request,
  ) {
    const { data, message } = await this.userService.saveCommonUserToDb(
      registerUserDto,
    );
    const { email, username } = registerUserDto;
    const { host } = req.headers;
    const link = `http://${host}/${UserEndpoints.emailConfirmation}?${Params.id}=${data.id}`;
    const logoLink = this.appService.getStaticImageByName({ name: 'logo.jpg' });

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: this.i18n.t('user.emailConfirmation'),
        template: './email-confirmation',
        context: {
          logoLink,
          appName: packageVariables.name,
          username,
          link,
          currentYear: new Date().getFullYear(),
        },
      });
      return { message };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(
        this.i18n.t('user.failedToSendEmailConfirmationLink'),
      );
    }
  }
}
