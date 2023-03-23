import { Injectable } from '@nestjs/common';
import { freteRapidoApi } from '../../configs';
import { IntegrationErrorException } from '../../exceptions';
import {
  GetQuotesFreteRapidoWrapper,
  GetQuotesProps,
  IFreteRapidoWrapper,
} from './interfaces';

@Injectable()
export class FreteRapidoWrapper implements IFreteRapidoWrapper {
  async getQuotes(
    props: GetQuotesProps,
  ): Promise<GetQuotesFreteRapidoWrapper | IntegrationErrorException> {
    const response = await this.request({
      url: `api/v3/quote/simulate`,
      method: 'post',
      params: props,
    });

    if (!response.request) {
      return new IntegrationErrorException();
    }
    return response;
  }

  private async request(props: {
    url: string;
    method: 'put' | 'post' | 'get';
    params?: any;
  }): Promise<GetQuotesFreteRapidoWrapper> {
    const { url, method, params } = props;
    try {
      const response = await freteRapidoApi[method](url, params);
      return { request: true, data: response?.data, status: response.status };
    } catch (error) {
      return {
        request: false,
        data: error?.response?.data,
        status: error?.response?.status,
      };
    }
  }
}
