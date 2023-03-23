import { HttpStatus } from '@nestjs/common';

export type GetQuoteProps = {
  lastQuotes?: number;
};

export type GetQuoteResponse = { data: any; statusCode: HttpStatus };

export interface IGetQuoteService {
  execute(props: GetQuoteProps): Promise<GetQuoteResponse>;
}
