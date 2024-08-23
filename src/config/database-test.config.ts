import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env.test' });

const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  autoLoadEntities: true,
  subscribers: [join(__dirname, '..', '**', '*.subscriber.{ts,js}')],
  maxQueryExecutionTime: 2000,
  extra: {
    poolSize: 20,
    connectionTimeoutMillis: 5000,
    query_timeout: 5000,
    statement_timeout: 5000,
  },
} as DataSourceOptions;

export default registerAs('databaseTest', () => config);
export const connectionSource = new DataSource(config);
