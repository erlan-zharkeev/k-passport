import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UserModel,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('K_PASSPORT_JWT_SIGN_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, UserService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
