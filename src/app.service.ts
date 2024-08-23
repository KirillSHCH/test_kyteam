import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): { status: string; tz: string; offset: number } {
    return {
      status: 'online',
      tz: this.configService.getOrThrow<string>('TZ'),
      offset: new Date().getTimezoneOffset(),
    };
  }
}
