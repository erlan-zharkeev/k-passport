import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

const packageJsonPath = path.resolve(__dirname, './../../../package.json');
const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
const { name, version } = JSON.parse(packageJsonContent);

export const packageVariables = { name, version };

enum Environment {
  development = 'development',
  production = 'production',
}

export interface IConfiguration {
  port: string;
  name: string;
  version: string;
}

export const nestConfig = (): IConfiguration => ({
  port: process.env.PORT,
  name,
  version,
});

const isProduction = process.env.NODE_ENV === Environment.production;
const envFilePath = isProduction ? '.env.production' : '.env.development';

export const Config = ConfigModule.forRoot({
  envFilePath,
  isGlobal: true,
  load: [nestConfig],
});

export const swaggerConfig = new DocumentBuilder()
  .setTitle(name)
  .setDescription(`API for ${name} service`)
  .setVersion(version)
  .build();

export const corsConfig = (configService: ConfigService) => {
  const origin = configService.get<string>('ALLOWED_HOST', '').split(',');
  return {
    origin,
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
  };
};
