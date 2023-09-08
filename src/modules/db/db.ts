import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export const DB = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    uri: `mongodb://db:${configService.get<string>('DATABASE_PORT')}/db`,
  }),
  inject: [ConfigService],
});
