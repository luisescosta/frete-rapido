import { IntegrationErrorException } from '../../../exceptions';

export type GetQuotesProps = {
  shipper: {
    registered_number: string;
    token: string;
    platform_code: string;
  };
  simulation_type: number[];
  recipient: {
    type: number;
    zipcode: number;
    country: 'BRA';
  };
  dispatchers: [
    {
      registered_number: string;
      zipcode: number;
      volumes: Volumes[];
    },
  ];
};

export type Volumes = {
  amount: number;
  category: string;
  sku: string;
  price: number;
  height: number;
  width: number;
  length: number;
  unitary_weight: number;
  unitary_price: number;
};

export type DataFreteRapidoResponse = {
  dispatchers: {
    offers: {
      carrier: { name: string };
      service: string;
      final_price: number;
      delivery_time: { days: number };
    }[];
  };
};

export type GetQuotesFreteRapidoWrapper = {
  request: boolean;
  data: DataFreteRapidoResponse;
  status: number;
};

export interface IFreteRapidoWrapper {
  getQuotes(
    props: GetQuotesProps,
  ): Promise<GetQuotesFreteRapidoWrapper | IntegrationErrorException>;
}

export const IFreteRapidoWrapper = Symbol('IFreteRapidoWrapper');
