import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  DatabaseException,
  IntegrationErrorException,
} from '../../../exceptions';
import { GetQuote, IQuoteRepository } from '../repositories/interfaces';
import {
  GetQuoteProps,
  GetQuoteResponse,
  IGetQuoteService,
} from './interfaces';

@Injectable()
export class GetQuoteService implements IGetQuoteService {
  constructor(
    @Inject(IQuoteRepository)
    private readonly repository: IQuoteRepository,
  ) {}
  async execute(props: GetQuoteProps): Promise<GetQuoteResponse> {
    const quotes = await this.repository.find(props);

    if (!quotes || !quotes.length) {
      return this.response({ quotes: [], minQuote: null, maxQuote: null });
    }

    const parsedQuotes = quotes.map((quote: GetQuote) => ({
      name: quote.name,
      min: Number(quote.min),
      max: Number(quote.max),
      avg: Number(quote.avg),
      count: Number(quote.count),
    }));

    const minAndMax = this.minAndMax(parsedQuotes);

    return this.response({ quotes: parsedQuotes, ...minAndMax });
  }

  private minAndMax(
    data: {
      name: string;
      min: number;
      max: number;
      avg: number;
      count: number;
    }[],
  ): {
    minQuote: {
      name: string;
      value: number;
    };
    maxQuote: {
      name: string;
      value: number;
    };
  } {
    const minQuotePrice = data.reduce(function (prev, current) {
      return Number(prev.min) < Number(current.min) ? prev : current;
    });

    const maxQuotePrice = data.reduce(function (prev, current) {
      return Number(prev.max) > Number(current.max) ? prev : current;
    });
    return {
      minQuote: { name: minQuotePrice.name, value: minQuotePrice.min },
      maxQuote: { name: maxQuotePrice.name, value: maxQuotePrice.max },
    };
  }

  private response(data: any): {
    data: any;
    statusCode: HttpStatus;
  } {
    if (
      data instanceof DatabaseException ||
      data instanceof IntegrationErrorException
    ) {
      return {
        data: {
          error: data.message,
          statusCode: data.statusCode,
        },
        statusCode: data.statusCode,
      };
    }

    if (data instanceof Error) {
      return {
        data: {
          error: 'Internal Error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data,
      statusCode: HttpStatus.OK,
    };
  }
}
