import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { GetQuoteDto } from '../dto/get-quote.dto';
import { CreateQuoteService } from '../services';
import { GetQuoteService } from '../services/get-quote.service';
import { ApiBody, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

const API_VERSION = 'v1';
@ApiTags('quotes')
@Controller(`api/${API_VERSION}/quotes`)
export class QuoteController {
  constructor(
    private readonly createQuoteService: CreateQuoteService,
    private readonly getQuoteService: GetQuoteService,
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      default: {
        carrier: [
          {
            name: 'EXPRESSO FR (TESTE)',
            service: 'Normal',
            deadline: 9,
            price: 101.16,
          },
          {
            name: 'RAPIDÃO FR (TESTE)',
            service: 'Normal',
            deadline: 9,
            price: 120.14,
          },
          {
            name: 'CORREIOS',
            service: 'Normal',
            deadline: 9,
            price: 131.1,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    schema: {
      default: {
        error: 'message',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: {
      default: {
        error: 'message',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    },
  })
  @ApiBody({
    schema: {
      example: {
        recipient: {
          address: {
            zipcode: '58071570',
          },
        },
        volumes: [
          {
            category: 7,
            amount: 1,
            unitary_weight: 5,
            price: 349,
            sku: 'abc-teste-123',
            height: 0.2,
            width: 0.2,
            length: 0.2,
          },
          {
            category: 1,
            amount: 2,
            unitary_weight: 4,
            price: 556,
            sku: 'abc-teste-527',
            height: 0.4,
            width: 0.6,
            length: 0.15,
          },
        ],
      },
    },
  })
  @Post()
  async store(@Body() dto: CreateQuoteDto, @Res() res): Promise<any> {
    const quotes = await this.createQuoteService.execute(dto);

    return res.status(quotes.statusCode).json(quotes.data);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      default: {
        quotes: [
          {
            name: 'CORREIOS',
            min: 131.1,
            max: 131.1,
            avg: 131.1,
            count: 1,
          },
          {
            name: 'EXPRESSO FR (TESTE)',
            min: 101.16,
            max: 101.16,
            avg: 101.16,
            count: 1,
          },
          {
            name: 'RAPIDÃO FR (TESTE)',
            min: 120.14,
            max: 120.14,
            avg: 120.14,
            count: 1,
          },
        ],
        minQuote: {
          name: 'EXPRESSO FR (TESTE)',
          value: 101.16,
        },
        maxQuote: {
          name: 'CORREIOS',
          value: 131.1,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    schema: {
      default: {
        error: 'message',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: {
      default: {
        error: 'message',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    },
  })
  @ApiQuery({
    required: false,
    name: 'last_quotes',
    type: Number,
  })
  @Get()
  async search(@Query() dto: GetQuoteDto, @Res() res): Promise<any> {
    const quotes = await this.getQuoteService.execute({
      lastQuotes: dto?.last_quotes,
    });
    return res.status(quotes.statusCode).json(quotes.data);
  }
}
