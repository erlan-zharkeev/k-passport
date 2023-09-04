import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PossibleUserSearchProperty, User, UserRole } from './@types';
import * as bcrypt from 'bcryptjs';
import { I18nService } from 'nestjs-i18n';
import { RegisterUserDto } from './dto/register-user-dto';
import { I18nTranslations } from 'src/modules/i18n/i18n.generated';
import { UserDto } from './dto/user-dto';
import { superAdminFixtures } from './fixtures';
import { ConfigService } from '@nestjs/config';
import { LogColor, cLog } from 'src/utils/cLog';
import { initCodes } from './constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly UserModel: Model<User>,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly configService: ConfigService,
  ) {}

  async loadFixtures() {
    try {
      await Promise.all(
        superAdminFixtures.map(async (admin) =>
          new this.UserModel({
            _id: new mongoose.Types.ObjectId(),
            password: await this.hashPassword({
              password: this.configService.get<string>('SUPER_ADMIN_PASS'),
            }),
            ...admin,
          }).save(),
        ),
      );
      cLog('- Fixtures loaded', LogColor.success);
    } catch (e) {
      const error = e as any;
      if (error.code === 11000) cLog('- Fixtures already exist');
      else cLog('- Fixtures not loaded', LogColor.error);
    }
  }

  async hashPassword({ password }: { password: string }) {
    try {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    } catch {
      throw new InternalServerErrorException(
        this.i18n.t('user.passwordHashFailed'),
      );
    }
  }

  async isUserExist({
    email = '',
    username = '',
  }: {
    email?: string;
    username?: string;
  }) {
    try {
      const candidate = await this.UserModel.findOne({
        $or: [{ email }, { username }],
      });
      let reasons = [];
      if (candidate) {
        if (candidate.username === username) reasons.push('username');
        if (candidate.email === email) reasons.push('email');
        return {
          reasons,
          id: candidate.id,
          username: candidate.username,
          email: candidate.email,
        }
      }
      return {
        reasons
      };
    } catch(e) {
      console.log(e)
      throw new InternalServerErrorException(
        this.i18n.t('user.failedToCheckUserExist'),
      );
    }
  }

  async saveCommonUserToDb({ username, email, password }: RegisterUserDto) {
    const { reasons } = await this.isUserExist({ email, username });
    console.log(reasons.length);
    if (reasons.length) {
      console.log('here');
      throw new ConflictException(
        this.i18n.t('user.userWithProvidedCredentialsAlreadyExist', {
          args: {
            reasons: reasons.join(', '),
          },
        }),
      );
    }
    try {
      const hashedPassword = await this.hashPassword({ password });
      const newUser = new this.UserModel({
        email,
        password: hashedPassword,
        role: UserRole.common,
        confirmed: false,
        username,
        confirmAttempts: 3,
        avatarPath: '',
        rt: '',
        codes: initCodes,
        data: {},
      });
      await newUser.save();
      return {
        data: newUser,
        message: this.i18n.t('user.registered'),
      };
    } catch {
      throw new InternalServerErrorException(
        this.i18n.t('user.failedToSaveToDb'),
      );
    }
  }

  async getUserByProperty({
    property,
    value,
    filters = [],
  }: {
    property: PossibleUserSearchProperty;
    value: string;
    filters?: Array<string>;
  }): Promise<UserDto | null> {
    try {
      const query = { [property]: value };
      const candidate = await this.UserModel.findOne(query).select('-rt -__v');
      let user: UserDto = null;
      if (candidate) {
        const {
          _id,
          username,
          avatarPath,
          password,
          data,
          email,
          role,
          confirmed,
        } = candidate;
        user = {
          id: String(_id),
          password,
          data: data ?? {},
          username,
          email,
          avatarPath,
          role: role,
          confirmed,
        };
        filters.forEach((filterKey) => {
          delete user[filterKey];
        });
      }
      return user;
    } catch {
      throw new InternalServerErrorException(
        this.i18n.t('user.failedToGetUserData'),
      );
    }
  }

  async updateRefreshToken({ id, token }: { id: string; token: string }) {
    try {
      await this.UserModel.updateOne({ _id: id }, { rt: token });
    } catch {
      throw new InternalServerErrorException(
        this.i18n.t('user.failedToUpdateRefreshToken'),
      );
    }
  }

  async markUserEmailConfirmed({ id }: { id: string }) {
    try {
      await this.UserModel.updateOne({ _id: id }, { confirmed: true });
    } catch {
      throw new InternalServerErrorException(
        this.i18n.t('user.failedToMarkEmailAsConfirmed'),
      );
    }
  }

  async updateCode({
    code,
    id,
    type,
  }: {
    code: string;
    id: string;
    type: string;
  }) {
    try {
      await this.UserModel.updateOne(
        { _id: id },
        {
          $set: {
            [`codes.${type}`]: {
              value: code,
              expires: Date.now(),
            },
          },
        },
      );
    } catch (e) {
      throw new InternalServerErrorException(
        this.i18n.t('user.failedToSaveCode'),
      );
    }
  }

  async updatePassword({
    id,
    hashedPassword,
  }: {
    id: string;
    hashedPassword: string;
  }) {
    try {
      return await this.UserModel.updateOne(
        { _id: id },
        { password: hashedPassword },
      );
    } catch {
      new InternalServerErrorException(
        this.i18n.t('user.failedToUpdatePassword'),
      );
    }
  }

  async getCode({ id, type }) {
    try {
      const user = await this.UserModel.findById(id);
      const { value, expires } = user.codes[type];
      if (!value || !expires) return [null, null];
      return [value, expires];
    } catch {
      throw new InternalServerErrorException(
        this.i18n.t('user.failedToGetCode'),
      );
    }
  }

  async checkCodeValidity({ id, type, code }) {
    try {
      const [userCode, codeTimestamp] = await this.getCode({ id, type });
      if (userCode !== code) {
        throw new BadRequestException(this.i18n.t('user.codeInvalid'));
      }
      const timeDifferenceInMinutes =
        (Number(Date.now()) - Number(codeTimestamp)) / (1000 * 60);

      const codesExpiresTimeout = Number(
        this.configService.get<string>('CODES_EXPIRED_TIMEOUT_IN_MINUTES'),
      );

      if (timeDifferenceInMinutes > codesExpiresTimeout) {
        throw new BadRequestException(this.i18n.t('user.codeIsExpired'));
      }

      return true;
    } catch {
      throw new InternalServerErrorException(
        this.i18n.t('user.failedToCompareCode'),
      );
    }
  }
}
