import { HttpStatus } from '@nestjs/common';

type Volume = {
  category: number;
  amount: number;
  unitary_weight: number;
  price: number;
  sku: string;
  height: number;
  width: number;
  length: number;
};

export type CreateQuoteProps = {
  recipient: {
    address: {
      zipcode: string;
    };
  };
  volumes: Volume[];
};

type Carrier = {
  name: string;
  service: string;
  deadline: number;
  price: number;
};

export type CreateQuote = {
  carrier: Carrier[];
};

export type CreateQuoteResponse = {
  data: any;
  statusCode: HttpStatus;
};

export interface ICreateQuoteService {
  execute(props: CreateQuoteProps): Promise<CreateQuoteResponse>;
}
