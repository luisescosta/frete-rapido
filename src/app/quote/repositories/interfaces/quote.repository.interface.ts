import { DatabaseException } from '../../../../exceptions';
import { QuoteModel } from '../../models';
QuoteModel;
export type CreateQuoteProps = {
  name: string;
  service: string;
  price: number;
  deadline: number;
};

export type GetQuoteProps = {
  lastQuotes?: number;
};

export type GetQuote = {
  name: string;
  max: string;
  min: string;
  avg: string;
  count: string;
};

export interface IQuoteRepository {
  create(props: CreateQuoteProps[]): Promise<boolean | DatabaseException>;
  find(props: GetQuoteProps): Promise<GetQuote[]>;
}

export const IQuoteRepository = Symbol('IQuoteRepository');
