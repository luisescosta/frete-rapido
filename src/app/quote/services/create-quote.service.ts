import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  DatabaseException,
  IntegrationErrorException,
} from '../../../exceptions';
import {
  requestFreteRapidoParser,
  responseFreteRapidoParser,
} from '../../../utils/parsers/frete-rapido.parser';
import { IFreteRapidoWrapper } from '../../../wrappers/frete-rapido';
import { IQuoteRepository } from '../repositories/interfaces';
import {
  CreateQuote,
  CreateQuoteProps,
  CreateQuoteResponse,
  ICreateQuoteService,
} from './interfaces';

@Injectable()
export class CreateQuoteService implements ICreateQuoteService {
  constructor(
    @Inject(IFreteRapidoWrapper)
    private readonly freteRapidoWrapper: IFreteRapidoWrapper,
    @Inject(IQuoteRepository)
    private readonly repository: IQuoteRepository,
  ) {}
  async execute(props: CreateQuoteProps): Promise<CreateQuoteResponse> {
    const dataRequest = requestFreteRapidoParser(props);

    const freteRapidoResponse = await this.freteRapidoWrapper.getQuotes(
      dataRequest,
    );

    if (freteRapidoResponse instanceof IntegrationErrorException) {
      return this.response(freteRapidoResponse, null);
    }

    const formatedResponse = responseFreteRapidoParser(
      freteRapidoResponse.data,
    );

    const quote = await this.repository.create(formatedResponse.carrier);
    return this.response(quote, formatedResponse);
  }

  private response(
    data: any,
    formatedResponse: CreateQuote | null,
  ): {
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
      data: formatedResponse,
      statusCode: HttpStatus.CREATED,
    };
  }
}
