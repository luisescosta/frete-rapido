import { Test, TestingModule } from '@nestjs/testing';

import { IGetQuoteService } from '../services/interfaces';
import { IQuoteRepository } from '../repositories/interfaces';

import { GetQuoteService } from '../services/get-quote.service';

describe('GetQuoteService', () => {
  let service: IGetQuoteService;
  let quoteRepository: IQuoteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetQuoteService,
        {
          provide: IQuoteRepository,
          useValue: {
            find: jest.fn().mockResolvedValue([
              {
                name: 'CORREIOS',
                max: '131.1',
                min: '131.1',
                avg: '131.10',
                count: '6',
              },
              {
                name: 'EXPRESSO FR (TESTE)',
                max: '101.16',
                min: '93.35',
                avg: '100.18',
                count: '8',
              },
              {
                name: 'RAPIDÃO FR (TESTE)',
                max: '120.14',
                min: '107.37',
                avg: '118.54',
                count: '8',
              },
              {
                name: 'SATURNO',
                max: '40766.83',
                min: '40766.83',
                avg: '40766.83',
                count: '1',
              },
            ]),
          },
        },
      ],
    }).compile();

    service = module.get<IGetQuoteService>(GetQuoteService);
    quoteRepository = module.get<IQuoteRepository>(IQuoteRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(quoteRepository).toBeDefined();
  });

  describe('get quote', () => {
    it('should be return quotes', async () => {
      const result = await service.execute({});
      expect(result).toStrictEqual({
        data: {
          quotes: [
            {
              name: 'CORREIOS',
              min: 131.1,
              max: 131.1,
              avg: 131.1,
              count: 6,
            },
            {
              name: 'EXPRESSO FR (TESTE)',
              min: 93.35,
              max: 101.16,
              avg: 100.18,
              count: 8,
            },
            {
              name: 'RAPIDÃO FR (TESTE)',
              min: 107.37,
              max: 120.14,
              avg: 118.54,
              count: 8,
            },
            {
              name: 'SATURNO',
              min: 40766.83,
              max: 40766.83,
              avg: 40766.83,
              count: 1,
            },
          ],
          minQuote: {
            name: 'EXPRESSO FR (TESTE)',
            value: 93.35,
          },
          maxQuote: {
            name: 'SATURNO',
            value: 40766.83,
          },
        },
        statusCode: 200,
      });
      expect(quoteRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should be return zero quotes', async () => {
      jest.spyOn(quoteRepository, 'find').mockResolvedValue([]);

      const result = await service.execute({});
      expect(result).toStrictEqual({
        data: {
          quotes: [],
          minQuote: null,
          maxQuote: null,
        },
        statusCode: 200,
      });
      expect(quoteRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should be return quotes using queryParam last_quotes', async () => {
      const LAST_QUOTES = 2;
      const result = await service.execute({ lastQuotes: LAST_QUOTES });
      expect(result).toStrictEqual({
        data: {
          quotes: [
            {
              name: 'CORREIOS',
              min: 131.1,
              max: 131.1,
              avg: 131.1,
              count: 6,
            },
            {
              name: 'EXPRESSO FR (TESTE)',
              min: 93.35,
              max: 101.16,
              avg: 100.18,
              count: 8,
            },
            {
              name: 'RAPIDÃO FR (TESTE)',
              min: 107.37,
              max: 120.14,
              avg: 118.54,
              count: 8,
            },
            {
              name: 'SATURNO',
              min: 40766.83,
              max: 40766.83,
              avg: 40766.83,
              count: 1,
            },
          ],
          minQuote: {
            name: 'EXPRESSO FR (TESTE)',
            value: 93.35,
          },
          maxQuote: {
            name: 'SATURNO',
            value: 40766.83,
          },
        },
        statusCode: 200,
      });
      expect(quoteRepository.find).toHaveBeenCalledWith({
        lastQuotes: LAST_QUOTES,
      });
      expect(quoteRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});
