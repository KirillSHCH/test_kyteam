import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from '../src/config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { ArticlesModule } from '../src/articles/articles.module';
import databaseTestConfig from '../src/config/database-test.config';
import { EventEmitterModule } from '@nestjs/event-emitter';

export const TestImports = [
  ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: true,
    envFilePath: '.env.test',
    load: [appConfig, databaseTestConfig],
  }),

  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({ ...configService.get('databaseTest') }),
  }),

  CacheModule.register({
    isGlobal: true,
    store: redisStore,
    host: 'localhost',
    port: 63790,
    ttl: 15,
  }),

  EventEmitterModule.forRoot(),

  UsersModule,

  AuthModule,

  ArticlesModule,
];
