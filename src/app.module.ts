import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuoteModel, QuotePricesModel } from './app/quote/models';
import { QuoteModule } from './app/quote/quote.module';
import { dataSourceOptions } from './configs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([QuoteModel, QuotePricesModel]),
    QuoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
