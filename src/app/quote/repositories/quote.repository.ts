import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DatabaseException } from '../../../exceptions';
import { ILoggerWrapper } from '../../../wrappers/logger/interfaces';
import { QuoteModel, QuotePricesModel } from '../models';
import {
  CreateQuoteProps,
  GetQuote,
  GetQuoteProps,
  IQuoteRepository,
} from './interfaces';

@Injectable()
export class QuoteRepository implements IQuoteRepository {
  constructor(
    @InjectRepository(QuoteModel)
    private readonly quoteModel: Repository<QuoteModel>,
    @InjectRepository(QuotePricesModel)
    private readonly quotePricesModel: Repository<QuotePricesModel>,
    @Inject(ILoggerWrapper)
    private readonly logger: ILoggerWrapper,
    private readonly dataSource: DataSource,
  ) {}

  async find(props: GetQuoteProps): Promise<GetQuote[]> {
    const { lastQuotes } = props;

    const queryB = this.quotePricesModel.createQueryBuilder('quotePrices');

    queryB.select('quotePrices.name', 'name');
    queryB.addSelect('MAX(quotePrices.price)', 'max');
    queryB.addSelect('MIN(quotePrices.price)', 'min');
    queryB.addSelect('CAST(AVG(quotePrices.price) AS DECIMAL(10,2))', 'avg');
    queryB.addSelect('COUNT(quotePrices.price)', 'count');
    queryB.groupBy('quotePrices.name');
    queryB.where((qb) => {
      const subQuery = qb.subQuery();
      subQuery.select('quote.id');
      subQuery.from(QuoteModel, 'quote');
      subQuery.orderBy('quote.createdAt', 'DESC');
      if (lastQuotes) {
        subQuery.limit(lastQuotes);
      }
      return `quotePrices.quoteId IN ${subQuery.getQuery()}`;
    });

    const result = await queryB.getRawMany();
    return result as GetQuote[];
  }

  async create(
    props: CreateQuoteProps[],
  ): Promise<boolean | DatabaseException> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const quote = await this.quoteModel
        .createQueryBuilder('quotePrices', queryRunner)
        .insert()
        .into(QuoteModel)
        .values({})
        .execute();

      const quotesPrices: {
        name: string;
        price: number;
        service: string;
        deadline: number;
        quoteId: number;
      }[] = props.map((quotePrice) => ({
        ...quotePrice,
        quoteId: quote.raw[0].id,
      }));

      await this.quotePricesModel
        .createQueryBuilder('quotePrices', queryRunner)
        .insert()
        .into(QuotePricesModel)
        .values(quotesPrices)
        .execute();

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await this.logger.execute({
        message: 'Database error, erro to save quote',
        error,
      });
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
      }
      return new DatabaseException();
    } finally {
      await queryRunner.release();
    }
  }
}
