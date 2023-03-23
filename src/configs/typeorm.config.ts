import { DataSource, DataSourceOptions } from 'typeorm';
import { QuotePricesModel } from '../app/quote/models';
import { QuoteModel } from '../app/quote/models/quote.model';
import { environment as env } from './env.config';

const { LOG_QUERY, DB_HOST, DB_PORT, DB_PASSOWRD, DB_USER, DB_NAME } = env;

export const dataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSOWRD,
  database: DB_NAME,
  schema: 'public',
  synchronize: false,
  logging: LOG_QUERY,
  entities: [QuoteModel, QuotePricesModel],
  migrations: ['./dist/database/migrations/**/*{.ts,.js}'],
  extra: {
    connectionLimit: 5,
  },
  cli: {
    migrationsDir: './src/database/migrations',
  },
} as DataSourceOptions;

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
