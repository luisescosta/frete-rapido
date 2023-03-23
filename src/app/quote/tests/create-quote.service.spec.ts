import { Test, TestingModule } from '@nestjs/testing';

import { ICreateQuoteService } from '../services/interfaces';
import { IQuoteRepository } from '../repositories/interfaces';
import {
  DatabaseException,
  IntegrationErrorException,
} from '../../../exceptions';
import { IFreteRapidoWrapper } from '../../../wrappers/frete-rapido';
import { CreateQuoteService } from '../services';

const mockFreteRapido = {
  request: true,
  data: {
    dispatchers: [
      {
        id: '6419f02f5a26df868581f54b',
        request_id: '6419f02f5a26df868581f54a',
        registered_number_shipper: '25438296000158',
        registered_number_dispatcher: '25438296000158',
        zipcode_origin: 29161376,
        offers: [
          {
            offer: 1,
            table_reference: '637b79e783c460c51214cc04',
            simulation_type: 0,
            carrier: {
              name: 'EXPRESSO FR (TESTE)',
              registered_number: '69436534000161',
              state_inscription: 'ISENTO',
              logo: 'https://s3.amazonaws.com/public.prod.freterapido.uploads/transportadora/foto-perfil/69436534000161.png',
              reference: 354,
              company_name: 'TRANSPORTADORA EXPRESSO FR (TESTE)',
            },
            service: 'Normal',
            delivery_time: {
              days: 5,
              hours: 19,
              minutes: 34,
              estimated_date: '2023-03-28',
            },
            expiration: '2023-04-20T17:58:07.961103863Z',
            cost_price: 93.35,
            final_price: 93.35,
            weights: {
              real: 13,
              cubed: 16,
              used: 16,
            },
            original_delivery_time: {
              days: 5,
              hours: 19,
              minutes: 34,
              estimated_date: '2023-03-28',
            },
          },
          {
            offer: 2,
            table_reference: '637b7a0d83c460c51214cc05',
            simulation_type: 0,
            carrier: {
              name: 'RAPIDÃO FR (TESTE)',
              registered_number: '32964513000109',
              state_inscription: 'ISENTO',
              logo: '',
              reference: 355,
              company_name: 'TRANSPORTADORA RAPIDÃO FR (TESTE)',
            },
            service: 'Normal',
            delivery_time: {
              days: 5,
              estimated_date: '2023-03-28',
            },
            expiration: '2023-04-20T17:58:07.96110976Z',
            cost_price: 107.37,
            final_price: 107.37,
            weights: {
              real: 13,
              cubed: 24,
              used: 24,
            },
            original_delivery_time: {
              days: 5,
              estimated_date: '2023-03-28',
            },
          },
          {
            offer: 3,
            simulation_type: 0,
            carrier: {
              name: 'SATURNO',
              registered_number: '37728379000160',
              state_inscription: '260632074',
              logo: '',
              reference: 1894,
              company_name: 'SATURNO BRASIL TRANSPORTES E REPRESENTACOES LTDA',
            },
            service: 'Entrega',
            delivery_time: {
              days: 2,
              estimated_date: '2023-03-23',
            },
            expiration: '2023-03-22T00:00:00Z',
            cost_price: 40766.83,
            final_price: 40766.83,
            weights: {
              real: 13,
            },
            original_delivery_time: {
              days: 2,
              estimated_date: '2023-03-23',
            },
            identifier: '238',
          },
        ],
      },
    ],
  },
};

const params = {
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
};

describe('CreateQuoteService', () => {
  let service: ICreateQuoteService;
  let quoteRepository: IQuoteRepository;
  let freteRapidoWrapper: IFreteRapidoWrapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateQuoteService,
        {
          provide: IQuoteRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: IFreteRapidoWrapper,
          useValue: {
            getQuotes: jest.fn().mockResolvedValue(mockFreteRapido),
          },
        },
      ],
    }).compile();

    service = module.get<ICreateQuoteService>(CreateQuoteService);
    quoteRepository = module.get<IQuoteRepository>(IQuoteRepository);
    freteRapidoWrapper = module.get<IFreteRapidoWrapper>(IFreteRapidoWrapper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(quoteRepository).toBeDefined();
    expect(freteRapidoWrapper).toBeDefined();
  });

  describe('create quote', () => {
    it('should be return ok', async () => {
      const result = await service.execute(params);

      expect(result).toStrictEqual({
        data: {
          carrier: [
            {
              deadline: 5,
              name: 'EXPRESSO FR (TESTE)',
              price: 93.35,
              service: 'Normal',
            },
            {
              deadline: 5,
              name: 'RAPIDÃO FR (TESTE)',
              price: 107.37,
              service: 'Normal',
            },
            {
              deadline: 2,
              name: 'SATURNO',
              price: 40766.83,
              service: 'Entrega',
            },
          ],
        },
        statusCode: 201,
      });

      expect(freteRapidoWrapper.getQuotes).toHaveBeenCalledWith({
        dispatchers: [
          {
            registered_number: undefined,
            volumes: [
              {
                amount: 1,
                category: '7',
                height: 0.2,
                length: 0.2,
                price: 349,
                sku: 'abc-teste-123',
                unitary_price: 349,
                unitary_weight: 5,
                width: 0.2,
              },
              {
                amount: 2,
                category: '1',
                height: 0.4,
                length: 0.15,
                price: 556,
                sku: 'abc-teste-527',
                unitary_price: 278,
                unitary_weight: 4,
                width: 0.6,
              },
            ],
            zipcode: NaN,
          },
        ],
        recipient: {
          country: 'BRA',
          type: 1,
          zipcode: 58071570,
        },
        shipper: {
          platform_code: undefined,
          registered_number: undefined,
          token: undefined,
        },
        simulation_type: [0],
      });
      expect(freteRapidoWrapper.getQuotes).toHaveBeenCalledTimes(1);
      expect(quoteRepository.create).toHaveBeenCalledWith([
        {
          name: 'EXPRESSO FR (TESTE)',
          service: 'Normal',
          deadline: 5,
          price: 93.35,
        },
        {
          name: 'RAPIDÃO FR (TESTE)',
          service: 'Normal',
          deadline: 5,
          price: 107.37,
        },
        {
          name: 'SATURNO',
          service: 'Entrega',
          deadline: 2,
          price: 40766.83,
        },
      ]);
      expect(quoteRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should be return Database Error', async () => {
      jest
        .spyOn(quoteRepository, 'create')
        .mockResolvedValue(new DatabaseException());

      const result = await service.execute(params);

      expect(result).toStrictEqual({
        data: { error: 'Database error' },
        statusCode: 500,
      });
      expect(freteRapidoWrapper.getQuotes).toHaveBeenCalledWith({
        dispatchers: [
          {
            registered_number: undefined,
            volumes: [
              {
                amount: 1,
                category: '7',
                height: 0.2,
                length: 0.2,
                price: 349,
                sku: 'abc-teste-123',
                unitary_price: 349,
                unitary_weight: 5,
                width: 0.2,
              },
              {
                amount: 2,
                category: '1',
                height: 0.4,
                length: 0.15,
                price: 556,
                sku: 'abc-teste-527',
                unitary_price: 278,
                unitary_weight: 4,
                width: 0.6,
              },
            ],
            zipcode: NaN,
          },
        ],
        recipient: {
          country: 'BRA',
          type: 1,
          zipcode: 58071570,
        },
        shipper: {
          platform_code: undefined,
          registered_number: undefined,
          token: undefined,
        },
        simulation_type: [0],
      });
      expect(freteRapidoWrapper.getQuotes).toHaveBeenCalledTimes(1);
      expect(quoteRepository.create).toHaveBeenCalledWith([
        {
          name: 'EXPRESSO FR (TESTE)',
          service: 'Normal',
          deadline: 5,
          price: 93.35,
        },
        {
          name: 'RAPIDÃO FR (TESTE)',
          service: 'Normal',
          deadline: 5,
          price: 107.37,
        },
        {
          name: 'SATURNO',
          service: 'Entrega',
          deadline: 2,
          price: 40766.83,
        },
      ]);
      expect(quoteRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should be return Integration Error', async () => {
      jest
        .spyOn(freteRapidoWrapper, 'getQuotes')
        .mockResolvedValue(new IntegrationErrorException());

      const result = await service.execute(params);

      expect(result).toStrictEqual({
        data: { error: 'Frete-rapido integration error' },
        statusCode: 404,
      });
      expect(freteRapidoWrapper.getQuotes).toHaveBeenCalledWith({
        dispatchers: [
          {
            registered_number: undefined,
            volumes: [
              {
                amount: 1,
                category: '7',
                height: 0.2,
                length: 0.2,
                price: 349,
                sku: 'abc-teste-123',
                unitary_price: 349,
                unitary_weight: 5,
                width: 0.2,
              },
              {
                amount: 2,
                category: '1',
                height: 0.4,
                length: 0.15,
                price: 556,
                sku: 'abc-teste-527',
                unitary_price: 278,
                unitary_weight: 4,
                width: 0.6,
              },
            ],
            zipcode: NaN,
          },
        ],
        recipient: {
          country: 'BRA',
          type: 1,
          zipcode: 58071570,
        },
        shipper: {
          platform_code: undefined,
          registered_number: undefined,
          token: undefined,
        },
        simulation_type: [0],
      });
      expect(freteRapidoWrapper.getQuotes).toHaveBeenCalledTimes(1);
      expect(quoteRepository.create).toHaveBeenCalledTimes(0);
    });
  });
});
