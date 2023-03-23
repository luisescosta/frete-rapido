import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  IFreteRapidoWrapper,
  FreteRapidoWrapper,
} from '../../wrappers/frete-rapido';
import { ILoggerWrapper } from '../../wrappers/logger/interfaces';
import { LoggerWrapper } from '../../wrappers/logger/logger.service';
import { QuoteController } from './controllers/quote.controller';
import { QuoteModel, QuotePricesModel } from './models';
import { IQuoteRepository } from './repositories/interfaces';
import { QuoteRepository } from './repositories/quote.repository';
import { CreateQuoteService } from './services';
import { GetQuoteService } from './services/get-quote.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuoteModel, QuotePricesModel])],
  controllers: [QuoteController],
  providers: [
    {
      useClass: FreteRapidoWrapper,
      provide: IFreteRapidoWrapper,
    },
    {
      useClass: QuoteRepository,
      provide: IQuoteRepository,
    },
    {
      useClass: LoggerWrapper,
      provide: ILoggerWrapper,
    },
    CreateQuoteService,
    GetQuoteService,
  ],
})
export class QuoteModule {}
