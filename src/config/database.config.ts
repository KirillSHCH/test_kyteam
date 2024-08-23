import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const isTrue = (value: unknown) => value === 'true';
const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: isTrue(process.env.DB_LOGGING),
  autoLoadEntities: true,
  migrations: ['dist/migrations/*{.ts,.js}'],
  subscribers: [join(__dirname, '..', '**', '*.subscriber.{ts,js}')],
  maxQueryExecutionTime: 2000,
  extra: {
    poolSize: 20,
    connectionTimeoutMillis: 5000,
    query_timeout: 5000,
    statement_timeout: 5000,
  },
} as DataSourceOptions;

export default registerAs('database', () => config);
export const connectionSource = new DataSource(config);
