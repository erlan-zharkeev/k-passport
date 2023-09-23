import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getStaticImageByName({ name }: { name: string }) {
    const host = this.configService.get<string>('HOST');
    return `${host}/images/${name}`;
  }
}
