import {
  CreateQuoteProps,
  CreateQuote,
} from '../../app/quote/services/interfaces';
import { environment as env } from '../../configs';
import { GetQuotesProps } from '../../wrappers/frete-rapido';

const { REGISTERED_NUMBER, AUTH_TOKEN, PLATFORM_CODE, COMPANY_ZIPCODE } = env;
export const requestFreteRapidoParser = (
  props: CreateQuoteProps,
): GetQuotesProps => {
  const {
    recipient: {
      address: { zipcode },
    },
  } = props;
  const volumes = props.volumes.map((volume) => ({
    ...volume,
    ...{ unitary_price: volume.price / volume.amount },
    ...{ category: volume.category.toString() },
  }));

  const getQuotes = {
    shipper: {
      registered_number: REGISTERED_NUMBER,
      token: AUTH_TOKEN,
      platform_code: PLATFORM_CODE,
    },
    simulation_type: [0],
    recipient: {
      type: 1,
      zipcode: Number(zipcode),
      country: 'BRA',
    },
    dispatchers: [
      {
        registered_number: REGISTERED_NUMBER,
        zipcode: Number(COMPANY_ZIPCODE),
        volumes: volumes,
      },
    ],
  } as GetQuotesProps;

  return getQuotes;
};

export const responseFreteRapidoParser = (props: any): CreateQuote => {
  const offers = [];
  for (const dispatcher of props.dispatchers) {
    offers.push(...dataResponseFreteRapidoParser(dispatcher.offers));
  }

  return {
    carrier: offers,
  } as CreateQuote;
};

export const dataResponseFreteRapidoParser = (
  data: any,
): {
  name: string;
  service: string;
  deadline: number;
  price: number;
}[] => {
  const formated: {
    name: string;
    service: string;
    deadline: number;
    price: number;
  }[] = data.map((data: any) => ({
    name: data.carrier.name,
    service: data.service,
    deadline: data.delivery_time.days,
    price: data.final_price,
  }));

  return formated;
};
